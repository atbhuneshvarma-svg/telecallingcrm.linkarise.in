import {FC, useState} from 'react'

interface Props {
  onSearch: (searchTerm: string) => void
  placeholder?: string
}

const SearchInput: FC<Props> = ({onSearch, placeholder = 'Search...'}) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Remove the useEffect - let user press Enter or use a search button
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm) // Only search when user presses Enter
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className='d-flex align-items-center position-relative'>
      <i className='ki-duotone ki-magnifier fs-3 position-absolute ms-3'>
        <span className='path1'></span>
        <span className='path2'></span>
      </i>
      <input
        type='text'
        className='form-control form-control-solid w-250px ps-10'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress} // Add this
      />
      {searchTerm && (
        <button
          type='button'
          className='btn btn-icon btn-sm btn-active-color-primary position-absolute end-0 me-3'
          onClick={handleClear}
        >
          <i className='ki-duotone ki-cross fs-2'>
            <span className='path1'></span>
            <span className='path2'></span>
          </i>
        </button>
      )}
    </div>
  )
}

export {SearchInput}