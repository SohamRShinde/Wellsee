import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from "../api.js"

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dt27lgrjo/image/upload'
const CLOUDINARY_UPLOAD_PRESET = 'my_unsigned_preset' 

export default function EditClub() {
    const { clubId } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: null,
        currentLogoUrl: ''
    })
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const res = await api.get('/api/clubs')
                const myClub = res.data.find(c => c._id === clubId)

                if(myClub) {
                    setFormData({
                        name: myClub.name,
                        description: myClub.description,
                        currentLogoUrl: myClub.logo || '',
                        logo: null
                    })
                } else {
                    alert("Club not found!")
                    navigate('/dashboard')
                }
            } catch (error) {
                console.error("Error loading club:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchClubDetails()
    }, [clubId, navigate])

    useEffect(() => {
        if (!formData.logo) {
            setPreviewUrl(formData.currentLogoUrl);
            return;
        }

        const objectUrl = URL.createObjectURL(formData.logo);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [formData.logo, formData.currentLogoUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if(file){
            setFormData(prev => ({ ...prev, logo: file }))
        }
    }

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const uploadingImageToCloudinary = async (file) => {
        if(!file) return formData.currentLogoUrl

        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

        try {
            const res = await api.post(CLOUDINARY_UPLOAD_URL, data, {
                withCredentials: false,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return res.data.secure_url
        } catch (error) {
            console.error("Cloudinary Error:", error)
            return null;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            const logoUrl = await uploadingImageToCloudinary(formData.logo)

            if(!logoUrl) {
                alert("Image upload failed")
                setUploading(false)
                return
            }

            await api.put(`/api/clubs/${clubId}`, {
                name: formData.name,
                description: formData.description,
                logo: logoUrl
            })

            alert("Club Profile Updated!")
            navigate('/dashboard')

        } catch (error) {
            console.error("Updated failed:", error)
            alert("Failed to update profile")
        } finally {
            setUploading(false)
        }
    }

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>

    return(
        <div className="max-w-xl mx-auto p-8 bg-gray-900 rounded-xl shadow-2xl mt-10 border border-gray-800">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Edit Club Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-6">
                    <img
                        src={previewUrl || "https://via.placeholder.com/150"}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shawdow-lg"
                    />
                </div>

                <div>
                    <label className="block text-blue-200 text-sm font-medium mb-1">Club Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700  px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-blue-200 text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700  px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-blue-200 text-sm font-medium mb-1">Update Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                        // className="mt-1 block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                    {uploading ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    )
}