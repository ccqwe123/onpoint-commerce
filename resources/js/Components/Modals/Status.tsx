import { motion, AnimatePresence } from "framer-motion";

interface ToggleModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isActive: boolean;
  type: string;
}

const Status = ({ show, onClose, onConfirm, isActive, type }: ToggleModalProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 !mt-0"
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-8 w-[400px] shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">
            {isActive ? "Set as Inactive?" : "Set as Active?"}
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to {isActive ? "deactivate" : "activate"} this {type}?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 rounded-lg text-white ${
                isActive
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Status;