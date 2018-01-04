# git commands I used during work

```bash
ng g c projects/admin-portal/configure/database -m projects/admin-portal/configure/configure.routing.module
```

```bash
git commit --no-verify --amend --no-edit
```

## push my new feature branch to staging

```bash
git branch -d staging/admin-portal   # delete local staging
git checkout project/admin-portal   # switch to master
git branch staging/admin-portal  # create staging branch based on master
git checkout staging/admin-portal  # switch to staging
git merge --no-edit origin/feature/admin-portal/myFeature --no-ff     # merge remote feature to staging, no fast forward to create a merge commit
git push -u origin staging/admin-portal -f  # push to remote force, set upstream
```

then build and deploy
