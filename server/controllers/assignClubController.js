import prisma from "../db.js";

import { sendDataMessage, sendNotification } from "./userController.js";

export const eventAssignforUser = async (req, res) => {
  const userId = req.user.id; 
  try {
   
    const eventData = await prisma.eventRSVP.create({
      data: {
        userId,
        eventId: req.body.eventId,
        status: req.body.status,
        flag: true,
      },
    });
    const userData = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  
    const event = await prisma.event.findFirst({
      where: {
        id: req.body.eventId,
      },
      select: {
        name: true,
        location: true,
        clubId: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }


    const clubMembership = await prisma.club.findFirst({
      where: {
        id: event.clubId, 
      },
      include: {
        memberships: true, 
      },
    });

    if (!clubMembership) {
      return res.status(404).json({ error: "Club membership not found" });
    }


    const notificationData = {
      userName: String(userData.name),
      name: String(event.name),
      location: String(event.location),
      status: String(req.body.status),
      topic: `club-${clubMembership.memberships[0].userId}`, // Use the user's ID for the topic
    };

    console.log("Notification Data:", notificationData);


    await sendDataMessage(
      notificationData,
      `club-${clubMembership.memberships[0].userId}`
    );


    await sendNotification(
      {
        title: "New Event Received",
        body: `Event: ${event.name} is ${req.body.status}`,
      },
      `club-${clubMembership.memberships[0].userId}-notifications`
    );

    res.status(200).json(eventData);
  } catch (error) {
    console.error("Error in eventAssignforUser:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
export const getFlag = async (req, res) => {
  const userId = req.user.id;

  try {
    const eventData = await prisma.eventRSVP.findFirst({
      where: {
        userId,
        eventId: req.params.id,
      },
      select: {
        flag: true,
      },
    });

    res.status(200).json(eventData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getClubEventsWithRSVPs = async (req, res) => {
  const userId = req.user.id; 
  try {
    
    const userData = await prisma.user.findUnique({
      where: {
        id: userId, 
      },
      include: {
        clubMemberships: {
          include: {
            club: {
              include: {
                events: {
                  include: {
                    rsvps: {
                      include: {
                        user: true, 
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  
    if (!userData || userData.clubMemberships.length === 0) {
      return res.status(404).json({ error: "No club found for the president" });
    }


    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch club events and RSVPs" });
  }
};
