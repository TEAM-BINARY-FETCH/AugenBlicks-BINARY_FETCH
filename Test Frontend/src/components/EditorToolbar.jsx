import React from "react";
import { FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo } from "react-icons/fa";

export default function EditorToolbar({ applyStyle }) {
  return (
    <div className="flex gap-2 bg-gray-800 p-2 rounded-md">
      {/* Bold */}
      <button onClick={() => applyStyle("bold")} className="p-2 bg-gray-700 text-white rounded"><FaBold /></button>
      {/* Italic */}
      <button onClick={() => applyStyle("italic")} className="p-2 bg-gray-700 text-white rounded"><FaItalic /></button>
      {/* Underline */}
      <button onClick={() => applyStyle("underline")} className="p-2 bg-gray-700 text-white rounded"><FaUnderline /></button>
      {/* Font Size */}
      <select onChange={(e) => applyStyle("fontSize", e.target.value)} className="p-2 bg-gray-700 text-white rounded">
        <option value="16px">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>
      {/* Font Color */}
      <input type="color" onChange={(e) => applyStyle("color", e.target.value)} className="w-10 h-10 rounded" />
      {/* Text Alignment */}
      <button onClick={() => applyStyle("justifyLeft")} className="p-2 bg-gray-700 text-white rounded"><FaAlignLeft /></button>
      <button onClick={() => applyStyle("justifyCenter")} className="p-2 bg-gray-700 text-white rounded"><FaAlignCenter /></button>
      <button onClick={() => applyStyle("justifyRight")} className="p-2 bg-gray-700 text-white rounded"><FaAlignRight /></button>
      {/* Undo / Redo */}
      <button onClick={() => applyStyle("undo")} className="p-2 bg-gray-700 text-white rounded"><FaUndo /></button>
      <button onClick={() => applyStyle("redo")} className="p-2 bg-gray-700 text-white rounded"><FaRedo /></button>
    </div>
  );
}
