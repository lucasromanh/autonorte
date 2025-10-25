// src/pages/SellCarPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { carService } from '@/services/carService';
import Button from '@/components/ui/Button';

const SellCarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    images: [] as File[],
    brand: '',
    model: '',
    year: '',
    mileage: '',
    engine: '',
    fuelType: 'nafta',
    transmission: 'manual',
    color: '',
    doors: 4,
    bodyType: 'Sedán',
    features: [] as string[],
    warranty: false,
    warrantyDetails: '',
    paymentMethods: ['Efectivo'],
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  // =========================
  // 🔧 Handlers
  // =========================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name === 'warranty') {
      setFormData(prev => ({
        ...prev,
        warranty: checked,
        warrantyDetails: checked ? prev.warrantyDetails : ''
      }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 6) {
        setError('Máximo 6 imágenes permitidas');
        return;
      }
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.brand && formData.model && formData.year && formData.price && formData.location);
      case 2:
        return !!(formData.mileage && formData.engine && formData.color);
      case 3:
        return true;
      case 4:
        return formData.images.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    } else {
      setError('Por favor complete todos los campos requeridos');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.title || !formData.brand || !formData.model || !formData.price || !formData.location || formData.images.length === 0) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      const result = await carService.createCar({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        images: formData.images,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || 0,
        mileage: parseInt(formData.mileage) || 0,
        engine: formData.engine,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        doors: formData.doors,
        bodyType: formData.bodyType,
        features: formData.features,
        warranty: formData.warranty,
        warrantyDetails: formData.warrantyDetails,
        paymentMethods: formData.paymentMethods,
        issues: []
      });

      if (result.success) {
        alert('¡Publicación creada exitosamente! La publicación estará disponible por 2 horas para pruebas.');
        navigate('/explore');
      } else {
        throw new Error(result.error || 'Error al crear la publicación');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar el vehículo');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // 🔩 Arrays disponibles
  // =========================
  const availableFeatures = [
    'Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso',
    'Sensores de estacionamiento', 'Bluetooth', 'Control de velocidad crucero',
    'Navegación GPS', 'Techo solar', 'Asientos de cuero', 'Llantas de aleación',
    'Faros LED', 'Espejos eléctricos', 'Vidrios eléctricos', 'Alarma'
  ];

  const availablePaymentMethods = [
    'Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito', 'Tarjeta de débito'
  ];

  // =========================
  // 🧱 Render principal
  // =========================
  return (
    <div className="mainflex">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Vender Mi Auto</h1>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Información Básica', 'Especificaciones', 'Características', 'Imágenes'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    currentStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-6">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Paso 1 */}
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
              {/* Campos: marca, modelo, año, precio, etc */}
              {/* ... (idéntico al bloque original, omitido por longitud) */}
            </>
          )}

          {/* Paso 2, 3, 4: igual que el bloque original */}
          {/* ... */}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={currentStep === 1 ? () => navigate('/') : prevStep}
              disabled={isLoading}
            >
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </Button>

            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} disabled={isLoading}>
                  Siguiente
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || formData.images.length === 0}>
                  {isLoading ? 'Publicando...' : 'Publicar Vehículo'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SellCarPage;
