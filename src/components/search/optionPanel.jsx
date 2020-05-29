import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import CheckBox from "../utility/checkbox";
import { uid } from "react-uid";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const OptionPanel = ({
  title = "Option panel",
  itemName = "option",
  choices = [],
  setChoices,
  insertEnabled = false,
}) => {
  const [newOption, setNewOption] = useState({ initiated: false, value: "" });
  const [hovered, setHovered] = useState(-1);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="col-12 d-none d-sm-block">
      <div className="row no-gutters p-4 convex bg-light mb-4 shn disable-select text-dark rounded-8">
        <div className="col-12 mb-2">{title}</div>
        {insertEnabled && (
          <div className="col-12 d-flex align-items-center p-2">
            <FaPlus
              fontSize="18px"
              onClick={() =>
                setNewOption((opt) =>
                  Object.assign({}, opt, { initiated: true })
                )
              }
            ></FaPlus>
            <div className="ml-2">Add new {itemName}</div>
          </div>
        )}
        {newOption.initiated && insertEnabled && (
          <div className="col-12 d-flex align-items-center p-2">
            <CheckBox
              size="25"
              checked={false}
              setChecked={(checked) => {}}
            ></CheckBox>
            <div className="ml-2">
              <input
                style={{ width: "80%" }}
                value={newOption.value}
                onKeyDown={(e) => {
                  e.persist();
                  if (e.keyCode === 13) {
                    setChoices((choices) => {
                      let arr = [...choices];
                      arr.unshift({
                        name: newOption.value,
                        checked: false,
                        deletable: true,
                      });
                      return arr;
                    });
                    setNewOption((opt) =>
                      Object.assign({}, opt, { initiated: false, value: "" })
                    );
                  }
                }}
                onChange={(e) => {
                  e.persist();
                  setNewOption((opt) =>
                    Object.assign({}, opt, { value: e.target.value })
                  );
                }}
              ></input>
            </div>
          </div>
        )}
        {choices.slice(0, showAll ? choices.length : 4).map((x, i) => (
          <div
            className="col-12 d-flex align-items-center p-2"
            key={uid(x)}
            onMouseOver={() => setHovered(i)}
            onMouseLeave={() => setHovered(-1)}
          >
            <CheckBox
              size="25"
              checked={x.checked}
              setChecked={(checked) => {
                setChoices((choices) => {
                  let arr = [...choices];
                  arr[i].checked = checked;
                  return arr;
                });
              }}
            ></CheckBox>
            <div className="mx-2" style={{ wordBreak: "break-word" }}>
              {x?.name?.length > 30 ? x.name.substring(0, 30) + "..." : x.name}
            </div>
            {x.deletable && hovered === i && (
              <FaTimes
                fontSize="18px"
                onClick={() =>
                  setChoices((choices) => {
                    let arr = [...choices];
                    arr.splice(i, 1);
                    return arr;
                  })
                }
              ></FaTimes>
            )}
          </div>
        ))}
        {choices.length > 4 && (
          <div
            className="col-auto mx-auto"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <FaCaretUp fontSize="24px"></FaCaretUp>
            ) : (
              <FaCaretDown fontSize="24px"></FaCaretDown>
            )}{" "}
            {showAll ? "less" : "more"}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionPanel;
