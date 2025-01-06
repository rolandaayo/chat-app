import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center text-gray-600">
        <p> {new Date().getFullYear()} ChatApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
