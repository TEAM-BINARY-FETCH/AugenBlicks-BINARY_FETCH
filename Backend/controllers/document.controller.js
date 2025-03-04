import Document from "../models/document.model.js";
import Project from "../models/project.model.js";
import VersionHistory from "../models/versionHistory.model.js";


export const createDocument = async (req, res) => {
  try {
    const { projectId, title } = req.body;

    // Check if project exists
    console.log("projectId in create document",projectId);
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const document = new Document({ project: projectId, title });
    await document.save();

    res.status(201).json({ message: "Document created", document });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get a document by ID
 */
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate("history");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update a document's content
 */


export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body; 

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const versionCount = await VersionHistory.countDocuments({ document: id });

    const newVersion = new VersionHistory({
      document: id,
      version_number: versionCount + 1,
      content,
      userId,
    });

    await newVersion.save();

    document.content = content;
    await document.save();

    res.json({ message: "Document updated", document, version: newVersion });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
/**
 * Delete a document
 */
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get all documents for a project
 */
export const getDocumentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const documents = await Document.find({ project: projectId });
    // console.log("documents",documents);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const renameDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const document = await Document.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document renamed", document });
  }
  catch(error){
    res.status(500).json({ message: "Error in Rename Document Controller", error });
  }
}

