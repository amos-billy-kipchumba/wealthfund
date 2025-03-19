import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, Upload, X, Camera, RefreshCw } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from "../../Components/ui/dialog";

const SelectCompany = () => {
    const { user, er } = usePage().props; 

    const { data, setData, post, errors } = useForm({
      passport_number: '',
      id_number: '',
      id_front: null,
      id_back: null,
      passport_front: null,
      passport_back: null,
      user_id: user.id,
      company_id: user?.company_id,
      unique_number: ''
    });

    const [previews, setPreviews] = useState({
      id_front: null,
      id_back: null,
      passport_front: null,
      passport_back: null
    });

    useEffect(() => {
        if (er) {
            toast.error(er, {
                duration: 4000,
                position: 'top-center',
            });
        }
    }, [er]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData(field, file);
            setPreviews(prev => ({
                ...prev,
                [field]: previewUrl
            }));
        }
    };

    const removePreview = (field) => {
        if (previews[field]) {
            URL.revokeObjectURL(previews[field]);
        }

        setData(field, null);
        setPreviews(prev => ({
            ...prev,
            [field]: null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] != null) {
                formData.append(key, data[key]);
            }
        });

        post(route('employees.store'), {
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    };

    const FileUploadPreview = ({ field, label, allowSelfie = false, allowBackCamera = false }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [stream, setStream] = useState(null);
        const videoRef = useRef(null);
        const [cameraFacing, setCameraFacing] = useState('user');
        
        const startCamera = async (facing = 'user') => {
            try {
                const constraints = {
                    video: { facingMode: facing }
                };
                const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setCameraFacing(facing);
                setIsOpen(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
                toast.error("Could not access camera. Please check permissions.");
            }
        };

        const stopCamera = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            setIsOpen(false);
        };

        const capturePhoto = () => {
            if (videoRef.current) {
                const canvas = document.createElement('canvas');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
                canvas.toBlob(blob => {
                    const file = new File([blob], `${field}-capture.jpg`, { type: 'image/jpeg' });
                    handleFileChange({ target: { files: [file] } }, field);
                }, 'image/jpeg');
                stopCamera();
            }
        };

        const switchCamera = () => {
            stopCamera();
            startCamera(cameraFacing === 'user' ? 'environment' : 'user');
        };

        return (
            <div className="mb-6">
                <Head title="Select company" />
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {!previews[field] ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex space-x-3">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field)}
                                    className="hidden" 
                                    id={`${field}-upload`}
                                />
                                <label 
                                    htmlFor={`${field}-upload`} 
                                    className="cursor-pointer flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <Upload className="mr-2 h-5 w-5" />
                                    Choose File
                                </label>
                                
                                {(allowSelfie || allowBackCamera) && (
                                    <button
                                        type="button"
                                        onClick={() => startCamera(allowBackCamera ? 'environment' : 'user')}
                                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        <Camera className="mr-2 h-5 w-5" />
                                        {allowSelfie ? 'Take Selfie' : 'Take Photo'}
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">
                                {allowSelfie ? 'Upload a file or take a selfie' : 'Upload a file or take a photo'}
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            <img 
                                src={previews[field]} 
                                alt="Preview" 
                                className="h-48 w-full object-contain rounded-md"
                            />
                            <button 
                                onClick={() => removePreview(field)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                                <X className="h-8 w-8" />
                            </button>
                        </div>
                    )}
                </div>
                {errors[field] && (
                    <div className="text-sm text-red-500 mt-1">{errors[field]}</div>
                )}

                <Dialog open={isOpen} onOpenChange={() => stopCamera()}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{allowSelfie ? 'Take a Selfie' : 'Take a Photo'}</DialogTitle>
                        </DialogHeader>
                        <div className="relative">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline
                                className="w-full h-[400px] object-cover rounded-lg"
                            />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                                <button
                                    onClick={capturePhoto}
                                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                >
                                    <Camera className="h-6 w-6" />
                                </button>
                                {allowBackCamera && (
                                    <button
                                        onClick={switchCamera}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                    >
                                        <RefreshCw className="h-6 w-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <Head title="KYC submission" />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
            <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                
                <div className="relative bg-white shadow-lg sm:rounded-3xl p-6">
                    <div className="flex justify-end mb-4">
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="text-sm bg-black text-white rounded-md hover:text-red-500 transition-colors px-4 py-2"
                        >
                            Logout
                        </Link>
                    </div>

                    <ol className="flex flex-col sm:flex-row justify-between text-sm font-medium text-gray-500 mb-6">
                        {[
                            { step: 1, label: 'Account setup', active: true },
                            { step: 2, label: 'KYC submission', active: true },
                            { step: 3, label: 'Verification & Approval', active: false }
                        ].map(({ step, label, active }) => (
                            <li 
                                key={step} 
                                className={`flex items-center space-x-2 ${active ? 'text-blue-600' : ''}`}
                            >
                                {active && <CheckCircle className="w-6 h-6" />}
                                <span>{step}. {label}</span>
                            </li>
                        ))}
                    </ol>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID number</label>
                            <input
                                type="text"
                                value={data.id_number}
                                onChange={(e) => setData('id_number', e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.id_number && <div className="text-sm text-red-500 mt-1">{errors.id_number}</div>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FileUploadPreview 
                                field="id_front" 
                                label="ID Front Side" 
                                allowBackCamera={true} 
                            />
                            <FileUploadPreview 
                                field="id_back" 
                                label="ID Back Side" 
                                allowBackCamera={true} 
                            />
                            <FileUploadPreview 
                                field="passport_front" 
                                label="Passport photo" 
                                allowSelfie={true} 
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SelectCompany;