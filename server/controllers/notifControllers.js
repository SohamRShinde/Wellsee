import Notification from '../models/Notification.js';
import Response from '../models/Response.js';
import Event from '../models/Events.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 }); 
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

const notifyParticipants = async (req, res) => {
    try {
        const { eventId, title, message } = req.body;

        if (!eventId || !title || !message) {
            return res.status(400).json({ message: "Event ID, title, and message are required." });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found." });

        if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'system_admin') {
             return res.status(403).json({ message: "You are not authorized to notify participants of this event." });
        }

        const responses = await Response.find({ formId: event.formId });

        if (responses.length === 0) {
            return res.status(404).json({ message: "No participants found for this event." });
        }

        const notificationsToCreate = responses.map(response => ({
            userId: response.userId,
            title: title,
            message: message,
            type: 'event_update'
        }));

        await Notification.insertMany(notificationsToCreate);

        res.status(200).json({ message: `Successfully sent notifications to ${responses.length} participants.` });

    } catch (error) {
        console.error("Notification Error:", error);
        res.status(500).json({ message: "Error sending notifications." });
    }
};

const sendInterviewReminder = async (req, res) => {
    try {
        const { userId, clubName, date, time, link, message } = req.body

        if(!userId || !clubName || !date || !time) {
            return res.status(400).json({ message: "Missing required details (User, Company, Date, Time)" })
        }

        const user = await User.findById(userId)
        if(!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const mailOptions = {
            form: process.env.SMTP_USER,
            to: user.email,
            subject: `interview Reminder: ${clubName}`,
            html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #2563EB;">Interview Reminder</h2>
                        <p>Hi ${user.name}</p>
                        <p>This is a reminder for your upcoming interview with <strong>${clubName}</strong>.</p>

                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                            <p><strong>Time:</strong> ${time}</p>
                            ${link ? `<p><strong>Link/Location:</strong> <a href="${link}">${link}</a></p>` : ''}
                        </div>

                        <p><strong>Note:</strong> ${message || "Good luck!"}</p>
                    </div>
                `
        }

        await transporter.sendMail(mailOptions)

        await Notification.create({
            userId: user._id,
            title: `Interview: ${clubName}`,
            message: `Reminder for interview on ${new Date(date).toDateString()} at ${time}.`,
            type: 'reminder'
        })

        res.status(200).json({ message: "Interview reminder sent via Email and Notification Center." })
    } catch (error) {
        console.error("Email Error:", error)
        res.status(500).json({ message: "Failed to send interview reminder.", error: error.message})
    }
}

const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
}

const announceNewEvent = async (req, res) => {
    try {
        const { eventId } = req.body

        if(!eventId){
            return res.status(400).json({ message: "Event Id is required." })
        }

        const event = await Event.findById(eventId);

        if(!event) {
            return res.status(404).json({ message: "Event not found." })
        }

        const existingNotification = await Notification.findOne({
            title: `New Event: ${event.title}`, 
            type: 'announcement'
        });

        if (existingNotification) {
            return res.status(409).json({ 
                message: "This event has already been announced! You cannot send duplicate notifications."
            });
        }

        if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'system_admin') {
             return res.status(403).json({ message: "Not authorized to announce this event." });
        }

        const students = await User.find({ role: 'student' }).select('_id')

        if(students.length === 0){
            console.log("9. No students found (Returning 404)");
            return res.status(404).json({ message: "No students found to notify." })
        }

        const notifications = students.map(student => ({
            userId: student._id,
            title: `New Event: ${event.title}`,
            message: `Check out ${event.title} happening on ${new Date(event.date).toDateString()}! Register now.`,
            type: 'announcement'
        }))
        await Notification.insertMany(notifications)

        res.status(200).json({ message: `Announcement sent to ${students.length} students.` })
    } catch (error) {
        console.error("Announcement Error:", error)
        res.status(500).json({ message: "Error sending announcement.", error: error.message})
    }
}

export{
    getUserNotifications,
    notifyParticipants,
    sendInterviewReminder,
    announceNewEvent,
    markAsRead
}