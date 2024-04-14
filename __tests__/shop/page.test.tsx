import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import SearchPage from '../../app/shop/page'
import axios from 'axios'


// Mock Next.js router

  jest.mock('next/navigation', () => ({
    usePathname() {
      return '';
    },
  }));
  jest.mock('next-intl/client', () => ({
    useRouter() {
      return {
        push: () => jest.fn(),
        replace: () => jest.fn(),
      };
    },
    usePathname() {
      return '';
    },
  }));
jest.mock('axios')

describe('SearchPage', () => {
  it('renders search input', () => {
    render(<SearchPage searchParams={{}} />)
    
    const searchInput = screen.getByRole('textbox')
    
    expect(searchInput).toBeInTheDocument()
  })

  it('displays loading spinner when fetching movies', () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    render(<SearchPage searchParams={{}} />)
    
    const spinner = screen.getByRole('img', { name: /spinner/i })
    
    expect(spinner).toBeInTheDocument()
  })

  it('displays movies list when movies data is fetched', async () => {
    const moviesData = [{ title: 'Movie 1' }, { title: 'Movie 2' }]
    axios.get.mockResolvedValueOnce({ data: moviesData })
    render(<SearchPage searchParams={{}} />)
    
    await waitFor(() => {
      const movieItems = screen.getAllByRole('listitem')
      expect(movieItems).toHaveLength(moviesData.length)
    })
  })
})
