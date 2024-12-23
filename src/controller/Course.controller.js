import { Course } from "../model/Course.models.js";

// Create a new course
const createCourse = async (req, res) => {
    try {
        // Validate the request body (you could extend this validation as needed)
        const { title, currentPrice, actualPrice, instructor, duration, language, mode, aboutCourse } = req.body;

        // Check if required fields are present
        if (!title || !currentPrice || !actualPrice || !instructor || !duration || !language || !mode || !aboutCourse) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create the course
        const course = await Course.create(req.body);

        // Return success response with course data
        res.status(201).json({
            message: 'Course created successfully',
            course
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.error(error);

        // Return an error response
        res.status(500).json({
            message: 'Error creating course',
            error: error.message || error
        });
    }
};

export { createCourse };
