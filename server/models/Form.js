import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event',
        required: true,
        unique: true 
    },
    title: {
        type: String,
        required: true
    },
    fields: [{
        id: { type: String, required: true }, 
        type: { type: String, required: true }, 
        label: { type: String, required: true }, 
        placeholder: String,
        required: { type: Boolean, default: false },
        options: [{ 
            id: String,
            text: String
        }]
    }]
}, { timestamps: true });

export default mongoose.model("Form", FormSchema);