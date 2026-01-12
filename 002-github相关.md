# github 相关的内容


## githubAPI 使用


* ChatGPT 回答

```text
GitHub 提供了强大的 API，允许你通过编程方式访问和操作 GitHub 上的资源，如存储库、问题、合并请求等。GitHub 的 API 文档可以在官方文档中找到，以下是一些有用的链接和基本信息：

	1.	GitHub REST API 文档:
	•	官方 REST API 文档：https://docs.github.com/en/rest
	•	REST API 入门指南：https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api
	2.	GitHub GraphQL API 文档:
	•	官方 GraphQL API 文档：https://docs.github.com/en/graphql
	•	GraphQL API 入门指南：https://docs.github.com/en/graphql/guides/introduction-to-graphql
	3.	GitHub API 认证:
	•	GitHub API 使用 OAuth2 认证，你需要生成访问令牌（Access Token）来进行身份验证。如何创建令牌请参考：https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token
	4.	示例代码:
	•	GitHub 提供了多种编程语言的示例代码，帮助你入门和使用他们的 API。这些示例代码可以在他们的 GitHub 存储库中找到：https://github.com/github
	5.	API 访问限制:
	•	注意，GitHub 对 API 的使用有一些限制，包括每小时的请求数限制。查看文档以了解详细信息。
	6.	API 终结点:
	•	GitHub API 的终结点 URL 可以通过拼接到 https://api.github.com 来访问。例如，获取某个用户信息的终结点是 https://api.github.com/users/username。

这些文档和资源应该足够帮助你开始使用 GitHub API 进行自动化的开发和集成。如果你有特定的问题或需要更详细的信息，请查阅官方文档或提出具体问题。
```


### 链接
* [GitHubAPI文档](https://docs.github.com/zh/rest)

### 查询拥有的仓库

* 仓库结构

```json
{
  "id": 686984544,
  "node_id": "R_kgDOKPKNYA",
  "name": "nunu-fabric",
  "full_name": "jianlu8023/nunu-fabric",
  "private": false,
  "owner": {
    "login": "jianlu8023",
    "id": 80561455,
    "node_id": "MDQ6VXNlcjgwNTYxNDU1",
    "avatar_url": "https://avatars.githubusercontent.com/u/80561455?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/jianlu8023",
    "html_url": "https://github.com/jianlu8023",
    "followers_url": "https://api.github.com/users/jianlu8023/followers",
    "following_url": "https://api.github.com/users/jianlu8023/following{/other_user}",
    "gists_url": "https://api.github.com/users/jianlu8023/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/jianlu8023/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/jianlu8023/subscriptions",
    "organizations_url": "https://api.github.com/users/jianlu8023/orgs",
    "repos_url": "https://api.github.com/users/jianlu8023/repos",
    "events_url": "https://api.github.com/users/jianlu8023/events{/privacy}",
    "received_events_url": "https://api.github.com/users/jianlu8023/received_events",
    "type": "User",
    "site_admin": false
  },
  "html_url": "https://github.com/jianlu8023/nunu-fabric",
  "description": null,
  "fork": false,
  "url": "https://api.github.com/repos/jianlu8023/nunu-fabric",
  "forks_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/forks",
  "keys_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/keys{/key_id}",
  "collaborators_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/collaborators{/collaborator}",
  "teams_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/teams",
  "hooks_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/hooks",
  "issue_events_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/issues/events{/number}",
  "events_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/events",
  "assignees_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/assignees{/user}",
  "branches_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/branches{/branch}",
  "tags_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/tags",
  "blobs_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/git/blobs{/sha}",
  "git_tags_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/git/tags{/sha}",
  "git_refs_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/git/refs{/sha}",
  "trees_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/git/trees{/sha}",
  "statuses_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/statuses/{sha}",
  "languages_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/languages",
  "stargazers_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/stargazers",
  "contributors_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/contributors",
  "subscribers_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/subscribers",
  "subscription_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/subscription",
  "commits_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/commits{/sha}",
  "git_commits_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/git/commits{/sha}",
  "comments_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/comments{/number}",
  "issue_comment_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/issues/comments{/number}",
  "contents_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/contents/{+path}",
  "compare_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/compare/{base}...{head}",
  "merges_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/merges",
  "archive_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/{archive_format}{/ref}",
  "downloads_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/downloads",
  "issues_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/issues{/number}",
  "pulls_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/pulls{/number}",
  "milestones_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/milestones{/number}",
  "notifications_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/notifications{?since,all,participating}",
  "labels_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/labels{/name}",
  "releases_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/releases{/id}",
  "deployments_url": "https://api.github.com/repos/jianlu8023/nunu-fabric/deployments",
  "created_at": "2023-09-04T11:13:32Z",
  "updated_at": "2023-09-04T11:14:10Z",
  "pushed_at": "2023-09-08T10:35:47Z",
  "git_url": "git://github.com/jianlu8023/nunu-fabric.git",
  "ssh_url": "git@github.com:jianlu8023/nunu-fabric.git",
  "clone_url": "https://github.com/jianlu8023/nunu-fabric.git",
  "svn_url": "https://github.com/jianlu8023/nunu-fabric",
  "homepage": null,
  "size": 144,
  "stargazers_count": 0,
  "watchers_count": 0,
  "language": "Go",
  "has_issues": true,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": true,
  "has_pages": false,
  "has_discussions": false,
  "forks_count": 0,
  "mirror_url": null,
  "archived": false,
  "disabled": false,
  "open_issues_count": 0,
  "license": {
    "key": "mit",
    "name": "MIT License",
    "spdx_id": "MIT",
    "url": "https://api.github.com/licenses/mit",
    "node_id": "MDc6TGljZW5zZTEz"
  },
  "allow_forking": true,
  "is_template": false,
  "web_commit_signoff_required": false,
  "topics": [],
  "visibility": "public",
  "forks": 0,
  "open_issues": 0,
  "watchers": 0,
  "default_branch": "master"
}
```

* 使用golang调用demo

```go

package query

import (
	"encoding/json"
	"fmt"

	"github.com/go-resty/resty/v2"
)

// License
// @Description:
// @Author ght
// @Date 2023-10-07 12:38:47
type License struct {
	Key    string `json:"key"`
	Name   string `json:"name"`
	SpdxId string `json:"spdx_id"`
	Url    string `json:"url"`
}

// QueryRepository
// @Description:
// @Author ght
// @Date 2023-10-07 12:01:33
type QueryRepository struct {
	Name          string   `json:"name"`
	Private       bool     `json:"private"`
	FullName      string   `json:"full_name"`
	Description   string   `json:"description"`
	GitUrl        string   `json:"git_url"`
	CloneUrl      string   `json:"clone_url"`
	Language      string   `json:"language"`
	License       *License `json:"license"`
	AllowForking  bool     `json:"allow_forking"`
	IsTemplate    bool     `json:"is_template"`
	Forks         int      `json:"forks"`
	Wathers       int      `json:"wathers"`
	DefaultBranch string   `json:"default_branch"`
	Disabled      bool     `json:"disabled"`
}

func (q *QueryRepository) String() string {
	bytes, _ := json.MarshalIndent(q, "", "    ")
	return string(bytes)
}

var (
	client = resty.New()
)

// QueryAllRepository
// @Description: QueryAllRepository
// @author ght
// @date 2023-10-07 12:01:25
func QueryAllRepository() {

	response, err := client.R().SetHeaders(map[string]string{}).Get("https://api.github.com/users/jianlu8023/repos")

	if err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
	}

	var repositories []QueryRepository

	err = json.Unmarshal(response.Body(), &repositories)

	if err != nil {
		fmt.Println(fmt.Sprintf("error: %s", err))
	}

	for _, repo := range repositories {
		fmt.Println(repo.String())
	}
}
func main() {
	QueryAllRepository()
}
```

### 创建仓库

* 使用golang调用demo

```go
package create

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

// CreateRepository
// @Description:
// @Author ght
// @Date 2023-10-07 12:52:14
type CreateRepository struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Private     bool   `json:"private"`
}

var (
	client = resty.New()
)

// CreateARepository
// @Description: CreateARepository
// @author ght
// @date 2023-10-07 12:57:22
// @param name:
// @param description:
// @param token:
// @param private:
func CreateARepository(name, description, token string, private bool) {
	// GitHub API endpoint
	url := "https://api.github.com/user/repos"

	// Create repository struct
	repo := CreateRepository{
		Name:        name,
		Description: description,
		Private:     private,
	}

	authorization := fmt.Sprintf("%s %s", "Bearer", token)
	fmt.Println(authorization)
	response, err := client.R().SetHeaders(map[string]string{
		"Content-Type":  "application/json",
		"Authorization": authorization,
	}).SetBody(repo).Post(url)

	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}

	// Print response status code
	fmt.Println("Response status code:", response.StatusCode())

}

// main
// @Description: 
//
// @author ght
// @date 2023-10-07 13:19:53
//
//
func main() {
	name := "demo"
	description := "这是一个使用github api创建仓库的demo"
	private := false
	token := "token"
	CreateARepository(name, description, token, private)
}
```

### 删除仓库

* 使用golang调用demo

```go

package delete

import (
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
)

var (
	client = resty.New()
)

// DeleteARepository
// @Description: DeleteARepository
// @author ght
// @date 2023-10-07 13:07:19
// @param owner:
// @param repositoryName:
// @param token:
func DeleteARepository(owner, repositoryName, token string) {
	authorization := fmt.Sprintf("Bearer %s", token)
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s", owner, repositoryName)
	response, err := client.R().SetHeaders(map[string]string{
		"Authorization": authorization,
	}).Delete(url)
	if err != nil {
		fmt.Println(fmt.Sprintf("err:%s", err))
		os.Exit(1)
	}
	fmt.Println(response.StatusCode())

}

// main
// @Description: 
//
// @author ght
// @date 2023-10-07 13:20:51
//
//
func main() {
	owner := "jianlu8023"
	repository := "demo"
	token := "token"
	DeleteARepository(owner, repository, token)
}
```


## github action 相关

### 链接
* [action使用样例](https://blog.csdn.net/z1360408752/article/details/113690103)
* [hutool获取农历](https://blog.csdn.net/JAVA_YU_XIN/article/details/103999755)
