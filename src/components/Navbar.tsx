
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-medical-500 mr-2" />
          <h1 className="text-2xl font-bold text-medical-700">MedFlow SOAP Scribe</h1>
        </div>
        <div>
          <span className="text-sm text-gray-500">Healthcare Documentation Assistant</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
