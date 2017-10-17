export const CLEAR_WORKSPACE_ERR = 'CLEAR_WORKSPACE_ERR';

export function clearWorkspaceErr() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_WORKSPACE_ERR
    });
  }
}
