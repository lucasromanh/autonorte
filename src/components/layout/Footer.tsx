import React from 'react';

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
              <li><a href="#" className="text-gray-300 hover:text-white">Inicio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Explorar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Publicar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Regiones</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Salta</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Jujuy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tucumán</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Catamarca</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contacto</h4>
            <p className="text-gray-300">Email: info@autonorte.com</p>
            <p className="text-gray-300">Tel: +54 9 387 123 4567</p>
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