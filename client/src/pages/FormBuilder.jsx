import { useState, useRef, useEffect } from "react"
import { nanoid } from "nanoid"
import axios from 'axios'
import { useParams } from "react-router-dom"

export default function FormBuilder() {
  const { eventId } = useParams()

  const [title, setTitle] = useState("")
  const [fields, setFields] = useState([
    { id: nanoid(), type: "text", label: "", placeholder: "", required: false }
  ]);
  const [activeFieldId, setActiveFieldId] = useState(null)
  const refs = useRef({});

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
        const activeRef = refs.current[activeFieldId]
        if (activeRef && !activeRef.contains(e.target)) {
            if (!e.target.closest('.field-controls-container')) {
                setActiveFieldId(null)
            }
        }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [activeFieldId])

  const addField = (type, index) => {
    const newField = { 
        id: nanoid(), 
        type, 
        label: "", 
        placeholder: "", 
        required: false,
        options: type === 'checkbox' ? [{ id: nanoid(), text: "Option 1" }] : []
    }
    const newFields = [...fields]
    newFields.splice(index + 1, 0, newField)
    setFields(newFields)
  };

  const updateField = (id, key, value) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
    setActiveFieldId(null);
  };

  const updateOptionText = (fieldId, optionId, text) => {
    setFields(fields.map(f => {
      if (f.id !== fieldId) return f;
      return {
        ...f,
        options: f.options.map(opt => 
          opt.id === optionId ? { ...opt, text } : opt
        )
      };
    }));
  };

  const addOption = (fieldId) => {
    setFields(fields.map(f => {
      if (f.id !== fieldId) return f;
      return {
        ...f,
        options: [...f.options, { id: nanoid(), text: `Option ${f.options.length + 1}` }]
      };
    }));
  };

  const removeOption = (fieldId, optionId) => {
    setFields(fields.map(f => {
      if (f.id !== fieldId) return f;
      return {
        ...f,
        options: f.options.filter(opt => opt.id !== optionId)
      };
    }));
  };
  
  const fieldTypes = [ //type is the part used in the code and label is the what is shown as the button name
    { type: "text", label: "Text" },
    { type: "checkbox", label: "Checkbox"}
  ];

  const handleSave = async () => {
    if(!title.trim()) {
      alert("Please enter a form title.")
      return
    }
    if (fields.length === 0) {
      alert("Please add atleast one question.")
      return
    }

    setIsSaving(true)

    try {
      const response = await axios.post("/api/events/saveForm", {
        eventId: eventId,
        title: title,
        fields: fields
      })

      console.log("Success:", response.data)
      alert("Form saved successfully!")

      // navigate(`/events/${eventId}`); might do ts
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Failed to save form. PLease try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8">
      <div className="max-w-3xl w-full">
        <div className="py-6 px-4 bg-gray-800 rounded-md shadow-lg mb-6">
          <input
            type="text"
            placeholder="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold text-blue-300 bg-gray-800 border-0 border-b-2 border-blue-500 focus:border-blue-300 focus:outline-none placeholder-blue-400/50"
          />
        </div>
      </div>

      {fields.map((f, i) => (
        <div
          key={f.id}
          ref={(el) => (refs.current[f.id] = el)}
          onClick={(e) => {
            if (!e.target.closest('.field-controls-container')) {
              setActiveFieldId(f.id);
            }
          }}
          className={`max-w-3xl w-full mt-4 p-4 rounded-xl shadow-lg transition-all duration-150 relative 
                    ${activeFieldId === f.id ? "bg-gray-800 border-2 border-gray-500 shadow-blue-500/30" : "bg-gray-800 border border-gray-700"}
          `}
        >
          <div className="flex gap-4 items-center mb-3 text-blue-200">
            <input
                type="text"
                value={f.label}
                onChange={(e) => updateField(f.id, "label", e.target.value)}
                onClick={(e) => e.stopPropagation()} 
                placeholder="Click to add question..."
                className="w-full text-xl px-3 font-bold text-blue-200 bg-gray-800/50 border-0  focus:placeholder-blue-400 focus:outline-none placeholder-blue-400/50"
            />

            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={f.required}
                onChange={(e) => updateField(f.id, "required", e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mr-1 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              Required
            </label>

            {fields.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        removeField(f.id);
                    }}
                    className="ml-auto text-red-400 hover:text-red-500 transition-colors"
                    aria-label="Remove field"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            )}
          </div>
          
          <div className="mt-4 p-4 border-0 rounded bg-gray-800/50">
            
            {f.type === 'checkbox' ? (
                <div className="flex flex-col gap-3">
                  {/* 1. Render Existing Options */}
                  {f.options && f.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-3 group">
                      {/* Visual Checkbox (Mock) */}
                      <div className="h-4 w-4 border-2 border-gray-500 rounded flex-shrink-0"></div>
          
                      {/* Option Text Input */}
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOptionText(f.id, option.id, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 text-gray-200 w-full py-1 focus:outline-none transition-colors"
                      />

                      {/* Remove Option Button (Only shows on hover) */}
                      {f.options.length > 1 && (
                        <button 
                          onClick={() => removeOption(f.id, option.id)}
                          className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* 2. The "Add Option" Ghost Input */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-gray-600 rounded flex-shrink-0 opacity-50"></div>
                    <input
                      type="text"
                      placeholder="Add option"
                      onFocus={() => addOption(f.id)}
                      readOnly 
                      className="bg-transparent text-gray-400 placeholder-gray-500 w-full py-1 focus:outline-none cursor-pointer hover:text-blue-400 transition-colors"
                    />
                  </div>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={f.placeholder}
                        onChange={(e) => updateField(f.id, "placeholder", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Click to add placeholder..."
                        className="block w-full text-sm py-2 bg-gray-800/50 border-0 border-b-2 border-blue-500 focus:border-blue-300 focus:outline-none "
                    />
                </>
            )}
          </div>
          
          {activeFieldId === f.id && (
            <div 
                className="field-controls-container absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-gray-900 border border-gray-500 rounded-full shadow-lg z-10"
                onClick={(e) => e.stopPropagation()}
            >
              {fieldTypes.map((field) => (
                <button
                  key={field.type}
                  onClick={() => addField(field.type, i)}
                  className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                  + {field.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <div className="max-w-3xl w-full mt-10">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            w-full font-bold py-3 rounded-xl shadow-md transition duration-150
            ${isSaving 
              ? "bg-gray-600 cursor-not-allowed text-gray-300" 
              : "bg-green-600 hover:bg-green-500 text-white"}
          `}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Form"
          )}
        </button>
      </div>
    </div>
  );
}


// import { useState, useRef, useEffect } from "react"
// import { nanoid } from "nanoid"

// export default function FormBuilder() {
//   const [title, setTitle] = useState("")
//   const [fields, setFields] = useState([
//     { id: nanoid(), type: "text", label: "", placeholder: "", required: false }
//   ]);
//   const [activeFieldId, setActiveFieldId] = useState(null)
//   const refs = useRef({});

//   useEffect(() => {
//     function handleClickOutside(e) {
//         const activeRef = refs.current[activeFieldId]
//         if (activeRef && !activeRef.contains(e.target)) setActiveFieldId(null)
//     }
//     document.addEventListener("click", handleClickOutside)
//     return () => document.removeEventListener("click", handleClickOutside)
//   }, [activeFieldId])

//   const addField = (type, index) => {
//     const newField = { id: nanoid(), type, label: "", placeholder: "", required: false}
//     const newFields = [...fields]
//     newFields.splice(index + 1, 0, newField)
//     setFields(newFields)
//   };

//   const updateField = (id, key, value) => {
//     setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
//       <div className="max-w-2xl w-full py-8 px-4 bg-white rounded-md">
//         <input
//           type="text"
//           placeholder="Form Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
//         />
//       </div>

//       {fields.map((f, i) => (
//         <div
//           key={f.id}
//           ref={(el) => (refs.current[f.id] = el)}
//           onClick={() => setActiveFieldId(f.id)}
//           className="max-w-2xl w-full bg-white mt-4 p-4 rounded-md shadow-sm"
//         >
//           <input
//             type="text"
//             placeholder="Label"
//             value={f.label}
//             onChange={(e) => updateField(f.id, "label", e.target.value)}
//             className="border p-1 mr-2"
//           />
//           <input
//             type="text"
//             placeholder="Placeholder"
//             value={f.placeholder}
//             onChange={(e) => updateField(f.id, "placeholder", e.target.value)}
//             className="border p-1 mr-2"
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={f.required}
//               onChange={(e) => updateField(f.id, "required", e.target.checked)}
//               className="mr-1"
//             />
//             Required
//           </label>

//           {activeFieldId === f.id && (
//             <div className="flex gap-2 mt-2">
//               {["text"].map((type) => (
//                 <button
//                   key={type}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     addField(type, i);
//                   }}
//                   className="border px-2 py-1 rounded hover:bg-gray-200"
//                 >
//                   + {type}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }