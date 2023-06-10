import { Octokit } from '@octokit/rest';

export default class GitHub {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  async createBlob(owner, repo, content) {
    const { data } = await this.octokit.git.createBlob({
      owner,
      repo,
      content,
      encoding: 'utf-8',
    });
    return data;
  }

  async getRef(owner, repo, ref) {
    const { data } = await this.octokit.git.getRef({
      owner,
      repo,
      ref,
    });
    return data;
  }

  async createTree(owner, repo, base_tree, tree) {
    const { data } = await this.octokit.git.createTree({
      owner,
      repo,
      base_tree,
      tree,
    });
    return data;
  }

  async createCommit(owner, repo, message, tree, parents) {
    const { data } = await this.octokit.git.createCommit({
      owner,
      repo,
      message,
      tree,
      parents,
    });
    return data;
  }

  async updateRef(owner, repo, ref, sha) {
    await this.octokit.git.updateRef({
      owner,
      repo,
      ref,
      sha,
    });
  }
}