# DevTinder API

## authRouter
- POST / signup
- POST / Login
- POST / Logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Get you the profiles of other users on platform


## Status: ignore, interested, accepeted, rejected ##

