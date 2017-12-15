# Gitlab by Cotton Hou

## Config

```bash
brew install git

git config --get-regexp user  # user.name, user.email

git config [—global] user.name "Guanghui Wang"
git config [—global] user.email "guanghuiw@vmware.com"

git config --global color.ui true
git config --global fetch.prune true
```

## Preference

Star the projects I'm interested.

<https://gitlab.eng.vmware.com/profile/preferences>

Set `Default dashboard` to `starred projects`

## Notification

1. <https://gitlab.eng.vmware.com/profile/notifications> and set "Global notification level" to disabled
1. change starred projects notification level to "participate"(in indivisual project overview page)

## Merge Request Settings

<https://gitlab.eng.vmware.com/repo/edit>

rep > Settings > General

create branch based on master, and then immediately create merge request, WIP: branchName(work in progress)

check​ "remove source branch when merge request is accepted."
