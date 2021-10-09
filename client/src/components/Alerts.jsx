import React from "react";

export default function Alerts(props) {
  if (props.type == "success") {
    return (
      <div>
        <div
          className="bg-green-100 border-l-4 border-green-500 rounded-md text-green-700 p-4"
          role="alert"
        >
          <p className="font-bold">Done Successfully</p>
          <p>{props.message}</p>
        </div>
      </div>
    );
  } else if (props.type == "error") {
    return (
      <div>
        <div
          className="bg-red-100 border-l-4 border-red-500 rounded-md text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Some thing worng</p>
          <p>{props.message}</p>
        </div>
      </div>
    );
  } else if (props.type == "info") {
    return (
      <div>
        <div
          className="bg-blue-100 border-l-4 border-blue-500 rounded-md text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Hint</p>
          <p>{props.message}</p>
        </div>
      </div>
    );
  }
}
