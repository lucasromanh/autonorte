import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">AutoNorte</h3>
            <p className="text-gray-300">
              La plataforma líder para compra y venta de autos en el norte argentino.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Inicio</Link></li>
              <li><Link to="/explore" className="text-gray-300 hover:text-white">Explorar</Link></li>
              <li><Link to="/sell-car" className="text-gray-300 hover:text-white">Publicar</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Regiones</h4>
            <ul className="space-y-2">
              <li><Link to="/explore?region=Salta" className="text-gray-300 hover:text-white">Salta</Link></li>
              <li><Link to="/explore?region=Jujuy" className="text-gray-300 hover:text-white">Jujuy</Link></li>
              <li><Link to="/explore?region=Tucumán" className="text-gray-300 hover:text-white">Tucumán</Link></li>
              <li><Link to="/explore?region=Catamarca" className="text-gray-300 hover:text-white">Catamarca</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contacto</h4>
            <p className="text-gray-300">Email: <a href="mailto:lucas@saltacoders.com" className="hover:underline">lucas@saltacoders.com</a></p>
            <p className="text-gray-300">Tel: <a href="tel:+5493874404472" className="hover:underline">+54 9 387 4404472</a></p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 AutoNorte. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;