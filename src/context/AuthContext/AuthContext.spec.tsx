import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { AuthProvider } from '.'
import { Profile } from '../../pages/Profile'
import { api } from '../../services/api'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  }),
  useLocation: () => ({
    pathname: '/'
  })
}))

jest.mock('../../services/api')

describe('AuthProvider', () => {
  it('should dispatch signIn function when invoked and return valid response', async () => {
    const signInMocked = mocked(api.post)
    const responseMock = {
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken: '84ee647c-ac74-4e34-bb84-1bd6c96b3977',
        permissions: ['users.list', 'users.create', 'metrics.list'],
        roles: ['administrator']
      }
    }

    signInMocked.mockReturnValueOnce({ ...responseMock } as any)

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    )

    const $signInButton = screen.getByTestId('signin-button')
    fireEvent.click($signInButton)

    await waitFor(() => {
      expect(signInMocked).toHaveBeenCalledTimes(1)
      expect(signInMocked).toHaveReturnedWith({ ...responseMock })
    }, { timeout: 1000 })
  })

  it('should dispatch signIn function when invoked and return invalid response', async () => {
    const signInMocked = mocked(api.post)

    signInMocked.mockRejectedValueOnce({})

    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    )

    const $signInButton = screen.getByTestId('signin-button')
    fireEvent.click($signInButton)

    await waitFor(() => {
      expect(signInMocked).toHaveBeenCalledTimes(1)
    }, { timeout: 1000 })
  })

  it('should call signOut function on click button', () => {
    // const signOut = jest.fn()
    render(
      <AuthProvider>
        <Profile />
      </AuthProvider>
    )

    const $signOutButton = screen.getByTestId('signout-button')
    fireEvent.click($signOutButton)
    // expect(signOut).toBeCalledTimes(0)
  })
})