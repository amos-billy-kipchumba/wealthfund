import React from 'react';

function Details({ company }) {

    const additionalDocuments = (() => {
        try {
          return company.additional_documents ? JSON.parse(company.additional_documents) : [];
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
          <span className="text-gray-800">{company.name}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Registration Number:</strong> 
          <span className="text-gray-800">{company.registration_number}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Industry:</strong> 
          <span className="text-gray-800">{company.industry}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Sectors:</strong> 
          <span className="text-gray-800">{company.sectors}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">County:</strong> 
          <span className="text-gray-800">{company.county}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Sub County:</strong> 
          <span className="text-gray-800">{company.sub_county}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Location:</strong> 
          <span className="text-gray-800">{company.location}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Address:</strong> 
          <span className="text-gray-800">{company.address}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Email:</strong> 
          <span className="text-gray-800">{company.email}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Phone:</strong> 
          <span className="text-gray-800">{company.phone}</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Percentage:</strong> 
          <span className="text-gray-800">{company.percentage}%</span>
        </div>
        <div className="flex justify-between">
          <strong className="text-gray-600">Unique Number:</strong> 
          <span className="text-gray-800">{company.unique_number}</span>
        </div>

        {/* Document Links */}
        <div className="border-t pt-4">
          <strong className="text-gray-600 mb-4">Documents:</strong>
          <div className="gap-4 flex items-center">
            {company.certificate_of_incorporation && (
              <a href={`/storage/${company.certificate_of_incorporation}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Certificate of Incorporation
              </a>
            )}
            {company.kra_pin && (
              <a href={`/storage/${company.kra_pin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                KRA PIN
              </a>
            )}
            {company.cr12_cr13 && (
              <a href={`/storage/${company.cr12_cr13}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                CR12/CR13
              </a>
            )}
            {company.signed_agreement && (
              <a href={`/storage/${company.signed_agreement}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
