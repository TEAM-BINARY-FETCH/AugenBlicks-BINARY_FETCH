import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Document from "../models/document.model.js";

/**
 * Create a new project
 */
export const createProject = async (req, res) => {
  try {
    const { title, ownerId } = req.body;

    const project = new Project({ title, owner: ownerId, members: [ownerId] });
    await project.save();

    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


/**
 * Get a project by ID
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("members");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addMemberToProject = async (req, res) => {
  try {
    const { projectId, userEmail } = req.body;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: user._id } },
      { new: true }
    ).populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Member added successfully", project });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Remove a member from a project
 */
export const removeMemberFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: userId } },
      { new: true }
    ).populate("members");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Member removed", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find projects where the user is a member
    const projects = await Project.find({ members: userId });

    // Get all documents for the user's projects
    const projectIds = projects.map((project) => project._id);
    const documents = await Document.find({ project: { $in: projectIds } });

    res.json({ projects, documents });
  } catch (error) {
    console.error("Error fetching projects and documents:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

