import Event from "../models/Events.js";

const createEvent = async (req, res) => {
    const { title, date, venue, description, banner, creator } = req.body;

    if (!title || !date || !venue || !description || !banner) {
        return res.status(400).json({ message: 'Please provide all required event details.' });
    }

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not identified." });
        }

        const newEvent = new Event({
            title,
            date,
            venue,
            description,
            banner, 
            creator: req.user.id
        });

        const savedEvent = await newEvent.save();
        
        res.status(201).json({ 
            message: 'Event created successfully!',
            event: savedEvent
        });

    } catch (error) {
        console.error("Database Save Error:", error);
        res.status(500).json({ message: 'Error saving event to database.', error: error.message });
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

const saveForm = async (req, res) => {
    const { eventId, title, fields } = req.body;

    const newForm = await Form.create({
        eventId,
        title,
        fields
    });

    await Event.findByIdAndUpdate(eventId, { 
        formId: newForm._id 
    });

    res.status(201).json(newForm);
}

export{
    createEvent,
    upcomingEvents,
    pastEvents,
    saveForm,
}