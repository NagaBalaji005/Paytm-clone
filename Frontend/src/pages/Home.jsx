import React from 'react';
import { ArrowRight, Lock, CheckCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import image from '../assets/photo1.avif';

const LandingPage = () => {

  const features = [
    {
      icon: <Lock className="w-10 h-10 text-gray-700" />,
      title: "Top-notch Security",
      description: "Your privacy is our priority with the most advanced encryption techniques."
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      title: "Seamless Experience",
      description: "Enjoy an intuitive interface and smooth navigation, designed for you."
    },
    {
      icon: <Heart className="w-10 h-10 text-red-600" />,
      title: "Customer-Centric",
      description: "We offer personalized features to suit your unique needs and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-sky-500 mb-6">
              <span className="text-sky-500">Simplifying</span> Your Payments, <span className="text-sky-500">Effortlessly</span>
            </h1>
            <p className="text-lg text-gray-800 mb-8">
              Unlock seamless, secure, and efficient payment solutions crafted to optimize your financial transactions with speed and simplicity.
            </p>
            <div className="flex gap-6">
              <Link to="/login">
                <button className="bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 hover:bg-sky-500 transition-all">
                  Get Started <ArrowRight />
                </button>
              </Link>
              <button className="border-2 text-sky-600 border-sky-600 px-8 py-4 rounded-xl font-semibold hover:bg-sky-100 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white p-12 rounded-3xl shadow-xl transform hover:scale-105 transition-all">
              <img src={image} alt="Landing" className="h-auto w-full object-cover rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-xl transition-all">
                <div className="flex justify-center items-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center mt-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-l from-sky-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future of Payments?</h2>
          <p className="text-xl mb-8">Sign up today and start using the easiest and most secure payment system available.</p>
          <Link to="/login">
            <button className="bg-sky-500 text-white px-12 py-4 rounded-xl font-semibold hover:bg-sky-400 transition-all">
              Start Your Journey
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
