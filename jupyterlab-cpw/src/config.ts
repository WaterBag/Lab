export const isDev = import.meta.env.MODE === 'dev'
// export const isDev = window.location.host !== 'app.example.com'

export const serverOrigin = isDev ? 'http://localhost:8889' : window.location.origin

