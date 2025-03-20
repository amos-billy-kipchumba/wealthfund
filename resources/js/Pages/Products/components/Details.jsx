import React from 'react';

function Details({ product }) {

    const additionalDocuments = (() => {
        try {
          return product.additional_documents ? JSON.parse(product.additional_documents) : [];
        } catch (error) {
          console.error("Invalid JSON format for additional documents:", error);
          return [];
        }
      })();
      

  return (
    <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex justify-between">
          <strong className="text-gray-600">Name:</strong> 
          <span className="text-gray-800">{product.name}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Registration Number:</strong> 
          <span className="text-gray-800">{product.registration_number}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Industry:</strong> 
          <span className="text-gray-800">{product.industry}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Sectors:</strong> 
          <span className="text-gray-800">{product.sectors}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">County:</strong> 
          <span className="text-gray-800">{product.county}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Sub County:</strong> 
          <span className="text-gray-800">{product.sub_county}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Location:</strong> 
          <span className="text-gray-800">{product.location}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Address:</strong> 
          <span className="text-gray-800">{product.address}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Email:</strong> 
          <span className="text-gray-800">{product.email}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Phone:</strong> 
          <span className="text-gray-800">{product.phone}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Percentage:</strong> 
          <span className="text-gray-800">{product.percentage}%</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Unique Number:</strong> 
          <span className="text-gray-800">{product.unique_number}</span>
        </div>

        {/* Document Links */}
        <div className="border-t pt-4">
          <strong className="text-gray-600 mb-4">Documents:</strong>
          <div className="gap-4 flex items-center">
            {product.certificate_of_incorporation && (
              <a href={`/storage/${product.certificate_of_incorporation}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Certificate of Incorporation
              </a>
            )}
            {product.kra_pin && (
              <a href={`/storage/${product.kra_pin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                KRA PIN
              </a>
            )}
            {product.cr12_cr13 && (
              <a href={`/storage/${product.cr12_cr13}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                CR12/CR13
              </a>
            )}
            {product.signed_agreement && (
              <a href={`/storage/${product.signed_agreement}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Signed Agreement
              </a>
            )}
          </div>
        </div>

        {/* Additional Documents */}
        {additionalDocuments.length > 0 && (
          <div className="border-t pt-4">
            <strong className="text-gray-600">Additional Documents:</strong>
            <ul className="mt-2 space-y-2">
              {additionalDocuments.map((doc, index) => (
                <li key={index}>
                  <a href={`/storage/${doc}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Document {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
