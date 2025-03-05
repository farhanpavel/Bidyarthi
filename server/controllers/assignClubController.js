import prisma from "../db.js";

import { sendDataMessage, sendNotification } from "./userController.js";

export const eventAssignforUser = async (req, res) => {
  const userId = req.user.id; // The user who is creating the event RSVP
  try {
    // Create a new event RSVP
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
    // Fetch event details
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

    // Fetch the club membership for the user
    const clubMembership = await prisma.club.findFirst({
      where: {
        id: event.clubId, // Ensure it's for the correct club
      },
      include: {
        memberships: true, // Include user details
      },
    });

    if (!clubMembership) {
      return res.status(404).json({ error: "Club membership not found" });
    }

    // Construct notification data
    const notificationData = {
      userName: String(userData.name),
      name: String(event.name),
      location: String(event.location),
      status: String(req.body.status),
      topic: `club-${clubMembership.memberships[0].userId}`, // Use the user's ID for the topic
    };

    console.log("Notification Data:", notificationData);

    // Send data message
    await sendDataMessage(
      notificationData,
      `club-${clubMembership.memberships[0].userId}`
    );

    // Send notification
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
  const userId = req.user.id; // Assuming the user making the request is logged in
  try {
    // Fetching club membership details for the president (assuming the president is a user with specific role)
    const userData = await prisma.user.findUnique({
      where: {
        id: userId, // Find user by their ID (club president)
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
                        user: true, // Include all users who RSVP'd to the event
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

    // Check if user data is found (club president and their club events)
    if (!userData || userData.clubMemberships.length === 0) {
      return res.status(404).json({ error: "No club found for the president" });
    }

    // Return the fetched data
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch club events and RSVPs" });
  }
};
