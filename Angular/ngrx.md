# ngrx

## Effects / Dispatch empty action conditionally

```ts
@Effect()
foo$ = this.actions$
  .ofType(ChatActions.FOO)
  .withLatestFrom(this.store, (action, state) => ({ action, state }))
  .mergeMap(({ action, state }) => {
    if (state.foo.isCool) {
      return Observable.of({ type: Actions.BAR });
    } else {
      return Observable.empty();
    }
  });

cancelCopyTask$ = this.actions$.pipe(
  ofType(TasksActionTypes.REMOVE_COPY_TASK),
  withLatestFrom(
    this.appStore.pipe(select(copiedObjectsSelector)),
    (action: CopyTaskRemoveAction, state) => ({
      action,
      state,
    }),
  ),
  // return action conditionally
  mergeMap(({ action, state }) => {
    if (action.sourceBucketName === state.sourceBucketName) {
      return of(new RemoveCopyObjectAction(action.task.taskName));
    } else {
      return EMPTY;
    }
  }),
);
```
