import Project from "../models/project.model.js";
import User from "../models/user.model.js";

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

/**
 * Add a member to a project
 */
export const addMemberToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } }, // Prevent duplicate members
      { new: true }
    ).populate("members");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Member added", project });
  } catch (error) {
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

/**
 * Get all projects for a user
 */
export const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ members: userId });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const addFavoriteProject = async (req, res) => {
  const {id: projectId} = req.params;
  const {userId} = req.user;
  console.log('Adding project to favorites:', projectId, userId);
  try {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favouriteProjects: projectId } },
      { new: true }
    )
    res.json({ message: "Project added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Error in AddFavorite Controller", error });
  }
};


export const removeFavoriteProject = async (req, res) => {
  const {id: projectId} = req.params;
  const {userId} = req.user;
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favouriteProjects: projectId } }, 
      { new: true }
    );
    res.json({ message: "Project removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error in removeFavoriteProject controller", error });
  }
};

export const getFavoriteProjects = async (req, res) => {
  const {userId} = req.user;
  try {
    const user = await User.findById(userId).populate("favouriteProjects"); 
    res.json(user.favouriteProjects);
  } catch (error) {
    console.error("Error fetching favorite projects:", error);
    res.status(500).json({ message: "Server error in getFavoriteProjects controller", error
    });
  }
};
