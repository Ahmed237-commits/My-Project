"use client";
import { useState, useEffect } from 'react';
import { FaHome, FaCheckCircle, FaStar, FaPlayCircle, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import Swal from 'sweetalert2'; 

// Component to display the list of lessons
const CourseContent = ({ onUnenroll }: { onUnenroll: () => void }) => {
    const lessons = [
        { id: 1, title: 'Introduction to Parts of Speech', completed: false },
        { id: 2, title: 'Understanding Nouns and Pronouns', completed: false },
        { id: 3, title: 'Verbs and Verb Tenses', completed: false },
        { id: 4, title: 'Adjectives, Adverbs, and Prepositions', completed: false },
        { id: 5, title: 'Building Complex Sentences', completed: false },
        { id: 6, title: 'Common Grammar Mistakes', completed: false },
    ];

    return (
        <section className="bg-white p-12 rounded-lg shadow-lg">
            <h2 className="text-5xl mb-8 text-gray-800">Course Lessons</h2>
            <ul className="divide-y divide-gray-200">
                {lessons.map(lesson => (
                    <Link key={lesson.id} href={`/Lessons/${lesson.id}`}>
                    <li key={lesson.id} className="py-8 flex items-center  justify-between">
                        <span className={`text-3xl cursor-pointer ${lesson.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            Lesson {lesson.id}: {lesson.title}
                        </span>
                        {lesson.completed ? (
                            <FaCheckCircle className="text-green-500 text-4xl" />
                        ) : (
                            <button className="text-blue-600 hover:text-blue-800 transition flex items-center space-x-2 text-3xl">
                                <FaPlayCircle />
                                <span>Start Lesson</span>
                            </button>
                        )}
                    </li>
                </Link>
                ))}
            </ul>
            <div className="mt-12 text-right">
                <button
                    onClick={onUnenroll}
                    className="text-red-600 hover:text-red-800 transition flex items-center justify-end space-x-2 text-3xl"
                >
                    <FaSignOutAlt />
                    <span className='cursor-pointer'>Unenroll from Course</span>
                </button>
            </div>
        </section>
    );
};

const EnrollmentScreen = ({ onEnroll }: { onEnroll: () => void }) => (
    <section className="bg-white p-12 rounded-lg shadow-lg text-center max-w-2xl mx-auto mt-20">
        <FaStar className="text-yellow-500 text-7xl mx-auto mb-8" />
        <h2 className="text-5xl text-gray-800 mb-6">Unlock This Course!</h2>
        <p className="text-3xl text-gray-600 mb-10">
            Enroll in the English Grammar Masterclass to gain access to all lessons and materials.
        </p>
        <button
            onClick={onEnroll}
            className="bg-green-600 cursor-pointer text-white px-12 py-5 rounded-lg text-3xl hover:bg-green-700 transition-colors duration-200"
        >
            Enroll in Course
        </button>
    </section>
);

// The main Lessons Page component
export default function LessonsPage() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const storedSubscription = localStorage.getItem('isSubscribed');
        if (storedSubscription === 'true') {
            setIsSubscribed(true);
        }
    }, []);

    const handleEnroll = () => {
        setIsSubscribed(true);
        localStorage.setItem('isSubscribed', 'true');
        Swal.fire({
            title: 'Sucess',
            text: 'You Have Enrolled To The Course',
            icon: 'success',
            confirmButtonText: 'Ok',
        });
    };

    const handleUnenroll = () => {
       Swal.fire({
  title: 'Warning',
  text: "Are You Sure To UnEnroll This Course!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, I`am Sure!'
}).then((result) => {
  if (result.isConfirmed) {
    setIsSubscribed(false);
        localStorage.removeItem('isSubscribed');
    Swal.fire('Confirmed!', 'Your Have Gone Out From Our Course.', 'success');
  } else if(result.isDenied) {
setIsSubscribed(true)
  }

});

    };

    return (
        <div className="min-h-screen bg-gray-100 p-12">
            <header className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
                <h1 className="text-6xl text-gray-800">English Grammar Masterclass</h1>
                <Link href="/dashBoard" className="text-blue-600 hover:text-blue-800 text-3xl transition">
                    <FaHome className="inline-block mr-2" />
                    Back to Dashboard
                </Link>
            </header>

            {isSubscribed ? <CourseContent onUnenroll={handleUnenroll} />  : <EnrollmentScreen onEnroll={handleEnroll} />}
        </div>
    );
}