import React, { useState } from "react";
import ReactDOM from "react-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CustomEditor = ({ model, setModel, title }) => {
  return (
    <div className="col-12">
      <div className="row no-gutters mx-auto">
        <div className="col-12 lead mb-2" style={{ fontWeight: "500" }}>
          {title}
        </div>
        <div
          className={`col-12 editorBlured`}
          style={{ height: "300px" }}
          id="editor"
        >
          <CKEditor
            editor={ClassicEditor}
            data={model}
            config={{
              toolbar: [
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
              ],
            }}
            onInit={(editor) => {}}
            onChange={(event, editor) => {
              const data = editor.getData();
              console.log({ event, editor, data });
              console.log(data);
              setModel(data);
            }}
            onBlur={(event, editor) => {
              console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              console.log("Focus.", editor);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const renderEditor = (containerId, title, model, setModel) => {
  ReactDOM.render(
    <CustomEditor model={model} setModel={setModel} title={title} />,
    document.getElementById(containerId)
  );
};
