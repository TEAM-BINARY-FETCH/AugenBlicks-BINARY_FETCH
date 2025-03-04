import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AIGenerateModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Prompt:', prompt);
    onSubmit(prompt);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
      overFlow="hidden"
    >
      <div className="p-[1px] bg-gradient-to-b from-blue-500 via-teal-400 to-purple-500 rounded-xl overflow-hidden">
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 w-[50rem] mx-auto">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 bg-clip-text text-transparent">
            Generate Templates with AI 
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt for AI generation..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-white"
              rows={5}
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onRequestClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};


export default AIGenerateModal;