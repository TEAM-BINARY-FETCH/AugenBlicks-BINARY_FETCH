import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import AIChatBot from "../components/AIChatBot";
import { specialChars } from "./../utils/specialChars.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {customTemplates} from "./../utils/customTemplates";
import AIGenerateModal from "../components/AIGenerateModal.jsx";
import useAITemplate from "../hooks/useAITemplate";




export default function App() {
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef(null);
  const [suggestedText, setSuggestedText] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAIContent } = useAITemplate();

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor; // Store the editor instance
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const fetchSuggestion = async (content) => {
    if (!content || content.length < 5) return; // Skip short content

    // Mock suggestion
    const suggestion = "Hello, how can I help you?";
    setSuggestedText(suggestion); // Set the AI suggestion
    console.log('Suggestion:', suggestion);
  };

  const acceptSuggestion = () => {
    if (!suggestedText || !editorRef.current) return;
    editorRef.current.insertContent(suggestedText); 
    setSuggestedText(""); // Clear the suggestion 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Fetching suggestion...');
      fetchSuggestion(editorContent); 
    }, 1000); // Fetch suggestion after 3 seconds of inactivity
    return () => clearTimeout(timer);
  }, [editorContent]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab" && suggestedText) {
        e.preventDefault(); // Prevent default tab behavior
        acceptSuggestion();
      }
    };

    editor.on("keydown", handleKeyDown);

    return () => {
      editor.off("keydown", handleKeyDown);
    };
  }, [suggestedText]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !suggestedText) return;

    // Get the cursor position
    const cursorPosition = editor.selection.getRng().getClientRects()[0];
    if (cursorPosition) {
      setSuggestionPosition({
        top: cursorPosition.top + window.scrollY + 20, 
        left: cursorPosition.left + window.scrollX,
      });
    }
  }, [suggestedText]);

  const handleTemplateSelect = (templateContent) => {
    if (editorRef.current) {
      editorRef.current.setContent(templateContent); // Load the selected template into the editor
    }
  };


  const handleAIGenerate = async (prompt) => {
    const aiContent = await generateAIContent(prompt); // Replace with your AI content generation logic
    if (aiContent && editorRef.current) {
      editorRef.current.insertContent(aiContent); // Insert the generated content into the editor
    } else {
      alert("Failed to generate content. Please try again.");
    }
  };
  return (
    <div className="">
      <div className="mb-2 flex items-center gap-x-2">
        <label htmlFor="template-select">Choose a Template: </label>

        <Select
          id="template-select"
          onValueChange={(value) => {
            const selectedTemplate = customTemplates.find(
              (template) => template.title === value
            );
            if (selectedTemplate) {
              handleTemplateSelect(selectedTemplate.content);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {customTemplates.map((template, index) => (
              <SelectItem key={index} value={template.title}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* TinyMCE Editor */}
      <Editor
      className="z-0"
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={handleEditorInit}
        onEditorChange={handleEditorChange}
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "ai",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | aigenerate",
          tinycomments_mode: "embedded",
          skin: "oxide-dark",
          content_css: "dark",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          dark_mode: true,
          height: 800,
          selector: "textarea#autocompleter-autocompleteitem",
          setup: (editor) => {
            // Add a custom AI button to the toolbar
            editor.ui.registry.addButton("aigenerate", {
              text: "AI Generate",
              onAction: () => setIsModalOpen(true),
            });

            // Autocompleter for special characters
            const onAction = (autocompleteApi, rng, value) => {
              editor.selection.setRng(rng);
              editor.insertContent(value);
              autocompleteApi.hide();
            };

            const getMatchedChars = (pattern) => {
              return specialChars.filter(
                (char) => char.text.indexOf(pattern) !== -1
              );
            };

            editor.ui.registry.addAutocompleter("specialchars", {
              trigger: ":",
              minChars: 1,
              columns: "auto",
              onAction: onAction,
              fetch: (pattern) => {
                return new Promise((resolve) => {
                  const results = getMatchedChars(pattern).map((char) => ({
                    type: "autocompleteitem",
                    value: char.value,
                    text: char.text,
                    icon: char.value,
                  }));
                  resolve(results);
                });
              },
            });

            // Add a placeholder for the suggestion
            editor.on("input", () => {
              console.log("Editor content:", editor.getContent());
              if (suggestedText) {
                const content = editor.getContent();
                if (!content.includes(suggestedText)) {
                  setSuggestedText(""); // Clear suggestion if editor content changes
                }
              }
            });
          },
        }}
        initialValue="Welcome to TinyMCE!"
      />

      <AIGenerateModal
      className="w-[400px]"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleAIGenerate}
      />

      {/* Suggestion UI */}
      {suggestedText && (
        <div
          style={{
            position: "absolute",
            top: suggestionPosition.top,
            left: suggestionPosition.left,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "gray",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          {suggestedText} (Press Tab to accept)
        </div>
      )}

      {/* AI Chat Button */}
      <AIChatBot
        editorContent={editorRef.current ? editorRef.current.getContent() : ""}
      />
    </div>
  );
}









