import { FaChevronDown } from 'react-icons/fa'
import React from 'react'

interface Option {
  id: number
  label: string
}

interface DropdownSelectorProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  placeholder: string
  value: number | string | null
  onChange: (value: number | null) => void
  options: Option[]
  disabled?: boolean
}

const DropdownSelector = ({
  icon,
  title,
  subtitle,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
}: DropdownSelectorProps) => {
  return (
    <div className={`bg-white rounded-xl border p-6 ${disabled ? 'opacity-50' : 'hover:shadow-md'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(Number(e.target.value) || null)}
          disabled={disabled}
          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

export default DropdownSelector
