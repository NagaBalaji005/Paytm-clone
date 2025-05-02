import React from 'react';

const Footer = () => {
  return (
    <div className="text-center p-5 bg-gray-100 border-t">
      <h1 className="text-black text-lg font-semibold">
        © {new Date().getFullYear()} Naga Balaji. All rights reserved.
      </h1>
    </div>
  );
};

export default Footer;
