import { mongoose } from "mongoose";

// Instructor Schema
const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    workExp: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
}, { _id: false });

// Main Course Schema
const courseSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
    },
    thumbnail: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    titleDetails: { 
        type: String, 
        required: true 
    },
    currentPrice: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    actualPrice: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    discountPercentage: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100 
    },
    channel_logo: { 
        type: String, 
        required: true 
    },
    channel_name: { 
        type: String, 
        required: true 
    },
    instructor: { 
        type: instructorSchema, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    language: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    mode: { 
        type: String, 
        enum: ['online', 'offline', 'hybrid'], 
        required: true 
    },
    aboutCourse: { 
        type: String, 
        required: true 
    },
    details: [
        { 
            title: { 
                type: String, 
                required: true 
            }, 
            description: { 
                type: String, 
                required: true 
            }
        },
    ],
    includes: { 
        type: [String], 
        required: true 
    },
    modules: [
        { 
            title: { 
                type: String, 
                required: true 
            }, 
            content: { 
                type: String, 
                required: true 
            }
        },
    ],
}, { timestamps: true });

// Indexing for frequently queried fields
courseSchema.index({ currentPrice: 1, startDate: 1 });

// Export model
export const Course = mongoose.model('Course', courseSchema);
