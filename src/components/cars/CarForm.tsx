import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { CreateCarData } from '@/services/carService';

interface CarFormProps {
  onSubmit: (data: CreateCarData) => void;
  loading?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ onSubmit, loading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Información básica
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    location: '',
    description: '',

    // Especificaciones técnicas
    mileage: '',
    engine: '',
    fuelType: 'nafta' as const,
    transmission: 'manual' as const,
    color: '',
    doors: 4,
    bodyType: 'Sedán',

    // Características
    features: [] as string[],

    // Garantía
    warranty: false,
    warrantyDetails: '',

    // Formas de pago
    paymentMethods: ['Efectivo'] as string[],

    // Imágenes
    images: [] as File[]
  });

  const [error, setError] = useState('');

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
        // Paso 3 (Características) es opcional - siempre válido
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Validar campos requeridos
      if (!formData.title || !formData.brand || !formData.model || !formData.price || !formData.location || formData.images.length === 0) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      onSubmit({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        images: formData.images,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar el vehículo');
    }
  };

  const availableFeatures = [
    'Aire acondicionado', 'Dirección asistida', 'ABS', 'Airbags', 'Cámara de retroceso',
    'Sensores de estacionamiento', 'Bluetooth', 'Control de velocidad crucero',
    'Navegación GPS', 'Techo solar', 'Asientos de cuero', 'Llantas de aleación',
    'Faros LED', 'Espejos eléctricos', 'Vidrios eléctricos', 'Alarma'
  ];

  const availablePaymentMethods = [
    'Efectivo', 'Transferencia', 'Financiación', 'Tarjeta de crédito', 'Tarjeta de débito'
  ];

  const bodyTypes = [
    'Sedán', 'Hatchback', 'SUV', 'Pickup', 'Furgoneta', 'Coupe', 'Convertible', 'Deportivo'
  ];

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['Información Básica', 'Especificaciones', 'Características', 'Imágenes'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > index + 1 ? 'bg-green-500 text-white' :
                currentStep === index + 1 ? 'bg-blue-500 text-white' :
                'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Información Básica */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marca *
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ej: Toyota"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Modelo *
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Ej: Corolla"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Año *
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Ej: 2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio *
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ej: 1500000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ubicación *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Buenos Aires, Argentina"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título del Anuncio *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Toyota Corolla 2020 Excelente Estado"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe detalladamente tu vehículo..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-vertical"
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 2: Especificaciones Técnicas */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Especificaciones Técnicas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kilometraje *
                </label>
                <Input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder="Ej: 85000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Motor *
                </label>
                <Input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  placeholder="Ej: 1.8L 16V"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Combustible
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="nafta">Nafta</option>
                  <option value="diesel">Diésel</option>
                  <option value="gnc">GNC</option>
                  <option value="electrico">Eléctrico</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transmisión
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="manual">Manual</option>
                  <option value="automatico">Automático</option>
                  <option value="cvt">CVT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color *
                </label>
                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ej: Blanco Perla"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Puertas
                </label>
                <select
                  name="doors"
                  value={formData.doors}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={2}>2 puertas</option>
                  <option value={3}>3 puertas</option>
                  <option value={4}>4 puertas</option>
                  <option value={5}>5 puertas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Carrocería
              </label>
              <select
                name="bodyType"
                value={formData.bodyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Características y Opciones */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Características y Opciones</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Características del Vehículo <span className="text-sm text-gray-500">(opcional)</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Selecciona solo las características que tenga tu vehículo</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Garantía</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.warranty}
                    onChange={(e) => handleCheckboxChange('warranty', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">El vehículo tiene garantía</span>
                </label>

                {formData.warranty && (
                  <Input
                    type="text"
                    name="warrantyDetails"
                    placeholder="Detalles de la garantía"
                    value={formData.warrantyDetails}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Métodos de Pago Aceptados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availablePaymentMethods.map(method => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method)}
                      onChange={() => handlePaymentMethodToggle(method)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Imágenes */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Imágenes del Vehículo</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fotos del Vehículo *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Haz clic para subir</span> o arrastra y suelta
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hasta 5MB cada una</p>
                  </div>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formData.images.length} imagen(es) seleccionada(s)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={currentStep === 1 ? () => window.history.back() : prevStep}
            disabled={loading}
          >
            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
          </Button>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={loading}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || formData.images.length === 0}
              >
                {loading ? 'Publicando...' : 'Publicar Vehículo'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default CarForm;