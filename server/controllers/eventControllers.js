import Event from "../models/Events.js";
import Form from "../models/Form.js"
import Response from "../models/Response.js"
import Club from "../models/Club.js"
import mongoose from "mongoose";

const createEventWithForm = async (req, res) => {
    const { 
        title, date, venue, description, banner, 
        formTitle, formFields
    } = req.body;

    if (!title || !date || !venue || !description || !banner || !formFields) {
        return res.status(400).json({ message: 'Please provide all required event and form details.' });
    }

    try {

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not identified." });
        }
        const club = await Club.findOne({ admin: req.user._id })
        if(!club){
            return res.status(403).json({ message: "You must be a Club Admin to create events."})
        }
        const eventId = new mongoose.Types.ObjectId();

        const newForm = new Form({
            eventId: eventId,
            title: formTitle,
            fields: formFields
        })

        const newEvent = new Event({
            _id: eventId,
            club: club._id,
            formId: newForm._id,
            title,
            date,
            venue,
            description,
            banner, 
            creator: req.user.id
        });

        await Promise.all([newForm.save(), newEvent.save()])
        
        res.status(201).json({ 
            message: 'Event and Form created successfully!',
            event: newEvent,
            form: newForm
        });

    } catch (error) {
        console.error("Creation Error:", error);
        res.status(500).json({ message: 'Error saving to database.', error: error.message });
    }
}

const upcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching upcoming events", error: error.message });
    }
}

const pastEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5; // Number of events per "Load More" click
        const skip = (page - 1) * limit;

        const today = new Date()
        today.setHours(0,0,0,0) 
        // Fetch the events
        const events = await Event.find({ date: { $lt: today } })
            .sort({ date: -1 }) // -1 = Descending (Dec before Jan)
            .skip(skip)
            .limit(limit);

        // Check if there are more events left in the database
        const totalPastEvents = await Event.countDocuments({ date: { $lt: new Date() } });
        const hasMore = totalPastEvents > (skip + events.length);
        res.status(200).json({ events, hasMore });
    } catch (error) {
        res.status(500).json({ message: "Error fetching past events", error: error.message });
    }
}

const registerForEvent = async (req, res) => {
    try {
        const { eventId, formId, answers } = req.body;
        const userId = req.user.id;

        const existingResponse =  await Response.findOne({ formId, userId })
        if(existingResponse) {
            return res.status(400).json({ message: "You have already registered for this event."})
        }

        const response = await Response.create({
            formId,
            userId,
            answers
        })
        //TODO
        // await Event.findByIdAndUpdate(eventId, { $push: { registrants: userId } })
        
        res.status(201).json({ message: "Registration successful!" })
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message})
    }
}

const getEventParticipants = async (req, res) => {
    try {
        const { eventId } = req.params

        const event = await Event.findById(eventId)
        if(!event || !event.formId) {
            return res.status(404).json({ message: "Event or Form not found" })
        }

        const responses = await Response.find({ formId: event.formId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
        
        res.status(200).json(responses)
    } catch (error) {
        res.status(500).json({ message: "Error fetching participants", error: error.message })
    }
}

export{
    createEventWithForm,
    upcomingEvents,
    pastEvents,
    registerForEvent,
    getEventParticipants
}