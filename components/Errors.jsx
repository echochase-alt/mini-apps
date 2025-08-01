export const Errors = ({playError, gameError, duplicateError, fullError, lengthError}) => {
  return (
    <>
      {playError && (
        <div style={{ color: "#E32636" }}>
          You don't have any players!
        </div>
      )}
      {gameError && (
        <div style={{ color: "#E32636" }}>Please enter a game name!</div>
      )}
      {duplicateError && (
        <div style={{ color: "#E32636" }}>
          Duplicate names are not allowed.
        </div>
      )}
      {fullError && (
        <div style={{ color: "#E32636" }}>
          Please enter a maximum of 10 players!
        </div>
      )}
      {lengthError && (
        <div style={{ color: "#E32636" }}>
          Please enter a maximum of 50 characters!
        </div>
      )}
    </>
  )
}