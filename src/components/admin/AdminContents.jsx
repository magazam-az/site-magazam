import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import AdminLayout from "./AdminLayout";

const AdminContents = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout pageTitle="Kontentlər">
      <div className="bg-gray-50 min-h-full p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#5C4977] mb-2">
                  Kontentlər İdarəetməsi
                </h1>
                <p className="text-gray-600">
                  Səhifə kontentlərini və bloklarını idarə edin
                </p>
              </div>
            </div>
          </div>

          {/* Page Content List */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#5C4977]/10 p-6 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5C4977]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Səhifə</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#5C4977]">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#5C4977]/5 hover:bg-[#5C4977]/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">Ana Səhifə</div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/contents/home/edit`)
                        }
                        className="p-2 text-[#5C4977] hover:text-[#5C4977]/70 hover:bg-[#5C4977]/10 rounded-lg transition-colors cursor-pointer"
                        title="Redaktə et"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContents;

