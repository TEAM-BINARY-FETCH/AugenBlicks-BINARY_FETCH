
import React from 'react'
import { Editor } from "@tinymce/tinymce-react";


const TextEditor = () => {
  return (
    <Editor
        className="z-0"
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={handleEditorInit}
        value={editorContent}
        onEditorChange={handleEditorChange}
        initialValue={""}
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
            // "ai",
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
        // initialValue="Welcome to TinyMCE!"
      />
  )
}

export default TextEditor