import React, { useState } from 'react';
import { CreditCard, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { PaymentMethod } from '../../types';

// Mock data for demonstration
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    userId: 'user1',
    type: 'credit',
    lastFour: '4242',
    expiryDate: '04/25',
    isDefault: true,
  },
  {
    id: '2',
    userId: 'user1',
    type: 'bank',
    lastFour: '9876',
    isDefault: false,
  },
  {
    id: '3',
    userId: 'user2',
    type: 'credit',
    lastFour: '1234',
    expiryDate: '12/24',
    isDefault: true,
  },
];

const PaymentMethodsList: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    accountNumber: '',
    routingNumber: '',
    accountName: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.userId === paymentMethods.find(m => m.id === id)?.userId
        ? { ...method, isDefault: method.id === id }
        : method
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPaymentMethod(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (newPaymentMethod.type === 'credit') {
      if (!newPaymentMethod.cardNumber) errors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(newPaymentMethod.cardNumber.replace(/\s/g, ''))) 
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      
      if (!newPaymentMethod.expiryDate) errors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate)) 
        errors.expiryDate = 'Please use MM/YY format';
      
      if (!newPaymentMethod.cvv) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(newPaymentMethod.cvv)) 
        errors.cvv = 'CVV must be 3 or 4 digits';
      
      if (!newPaymentMethod.nameOnCard) errors.nameOnCard = 'Name on card is required';
    } else if (newPaymentMethod.type === 'bank') {
      if (!newPaymentMethod.accountNumber) errors.accountNumber = 'Account number is required';
      else if (!/^\d{8,17}$/.test(newPaymentMethod.accountNumber)) 
        errors.accountNumber = 'Please enter a valid account number';
      
      if (!newPaymentMethod.routingNumber) errors.routingNumber = 'Routing number is required';
      else if (!/^\d{9}$/.test(newPaymentMethod.routingNumber)) 
        errors.routingNumber = 'Please enter a valid 9-digit routing number';
      
      if (!newPaymentMethod.accountName) errors.accountName = 'Account name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newMethod: PaymentMethod = {
      id: `new-${Date.now()}`,
      userId: 'user1', // This would come from authenticated user
      type: newPaymentMethod.type as 'credit' | 'bank',
      lastFour: newPaymentMethod.type === 'credit' 
        ? newPaymentMethod.cardNumber.slice(-4) 
        : newPaymentMethod.accountNumber.slice(-4),
      expiryDate: newPaymentMethod.type === 'credit' ? newPaymentMethod.expiryDate : undefined,
      isDefault: paymentMethods.length === 0 || !paymentMethods.some(m => m.userId === 'user1'),
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddForm(false);
    setNewPaymentMethod({
      type: 'credit',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      accountNumber: '',
      routingNumber: '',
      accountName: '',
    });
  };

  const getPaymentMethodIcon = (type: string) => {
    return type === 'credit' 
      ? <CreditCard className="h-6 w-6 text-blue-500" />
      : <CreditCard className="h-6 w-6 text-green-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowAddForm(!showAddForm)}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Add Payment Method
        </Button>
      </div>
      
      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Payment Method</h3>
          <form onSubmit={handleAddPaymentMethod}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type
              </label>
              <select
                name="type"
                value={newPaymentMethod.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="credit">Credit/Debit Card</option>
                <option value="bank">Bank Account</option>
              </select>
            </div>
            
            {newPaymentMethod.type === 'credit' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newPaymentMethod.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full p-2 border ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={newPaymentMethod.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`w-full p-2 border ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {formErrors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={newPaymentMethod.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`w-full p-2 border ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    />
                    {formErrors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={newPaymentMethod.nameOnCard}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className={`w-full p-2 border ${formErrors.nameOnCard ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.nameOnCard && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nameOnCard}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={newPaymentMethod.accountNumber}
                    onChange={handleInputChange}
                    placeholder="12345678901234567"
                    className={`w-full p-2 border ${formErrors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.accountNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.accountNumber}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={newPaymentMethod.routingNumber}
                    onChange={handleInputChange}
                    placeholder="123456789"
                    className={`w-full p-2 border ${formErrors.routingNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.routingNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.routingNumber}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={newPaymentMethod.accountName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className={`w-full p-2 border ${formErrors.accountName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {formErrors.accountName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.accountName}</p>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
              >
                Add Payment Method
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div 
              key={method.id} 
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                {getPaymentMethodIcon(method.type)}
                <div className="ml-4">
                  <p className="font-medium">
                    {method.type === 'credit' ? 'Credit/Debit Card' : 'Bank Account'} 
                    {method.isDefault && (
                      <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {method.type === 'credit' 
                      ? `•••• •••• •••• ${method.lastFour}` 
                      : `Account ending in ${method.lastFour}`}
                  </p>
                  {method.expiryDate && (
                    <p className="text-gray-600 text-sm">Expires: {method.expiryDate}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!method.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                    icon={<CheckCircle className="h-4 w-4" />}
                  >
                    Set Default
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(method.id)}
                  icon={<Trash2 className="h-4 w-4" />}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No payment methods added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsList;