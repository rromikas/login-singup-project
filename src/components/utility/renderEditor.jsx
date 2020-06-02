import React from "react";
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
              setModel(data);
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
