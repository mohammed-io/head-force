import React, { Component } from 'react'
import Axios from 'axios';
import Layout from '../../components/layout'

import { Collapse } from 'reactstrap'

export default class Posts extends Component {
  state = {
    posts: [],
    categories: [],
    formOpen: false,
    newPost: { title: '', body: '', categoryId: 1 }
  }

  componentDidMount() {
    Axios.get('http://localhost:3000/posts')
      .then(res => {
        this.setState({
          posts: res.data
        })

        return Axios.get('http://localhost:3000/categories')
      })
      .then(res => {
        this.setState({
          categories: res.data
        })
      })
  }

  toggleForm = () => {
    this.setState({
      formOpen: !this.state.formOpen
    })
  }

  handleEdit = (post) => {
    this.setState({
      newPost: { ...post },
      formOpen: true
    })
  }

  submitForm = (e) => {
    e.preventDefault();

    const { id } = this.state.newPost;

    if (!!id) {
      Axios.put('http://localhost:3000/posts/' + id, this.state.newPost)
        .then(res => {
          this.setState({
            newPost: { title: '', cover: '', body: '', categoryId: 1 },
            formOpen: false,
            posts: this.state.posts.map(x => {
              if (x.id === id) {
                return res.data;
              }

              return x;
            })
          })
        })
    } else {
      Axios.post('http://localhost:3000/posts', this.state.newPost)
        .then(res => {
          this.setState({
            newPost: { title: '', cover: '', body: '', categoryId: 1 },
            posts: [...this.state.posts, res.data]
          })
        })
    }
}

handleChange = e => {
  this.setState({
    newPost: {
      ...this.state.newPost,
      [e.target.name]: e.target.value
    }
  })
}

handleDelete = id => {
  Axios.delete('http://localhost:3000/posts/' + id)
    .then(res => {
      this.setState({
        posts: this.state.posts.filter(x => x.id !== id)
      })
    });
}

clearForm = () => {
  this.setState({
    newPost: { title: '', cover: '', body: '', categoryId: 1 },
    formOpen: false
  })
}

render() {
  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12 py-2">
          <button className="btn btn-success" onClick={this.toggleForm}>
            New Post
            </button>
        </div>
        <div className="col-lg-12">
          <Collapse isOpen={this.state.formOpen}>
            <form method="post" onSubmit={this.submitForm}>
              <div className="form-group">
                <input name="title" required
                  value={this.state.newPost.title}
                  onChange={this.handleChange}
                  type="text" placeholder="Title"
                  className="form-control" />
              </div>
              <div className="form-group">
                <input name="cover" required
                  value={this.state.newPost.cover}
                  onChange={this.handleChange}
                  type="text" placeholder="Cover"
                  className="form-control" />
              </div>
              <div className="form-group">
                <select name="categoryId"
                  className="form-control"
                  onChange={this.handleChange}
                  value={this.state.newPost.categoryId}>
                  <option value={0} disabled>Select a category</option>
                  {
                    this.state.categories.map(cat => (
                      <option key={cat.id}
                        value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="form-group">
                <textarea name="body" required
                  onChange={this.handleChange}
                  value={this.state.newPost.body}
                  type="text" placeholder="Body..."
                  className="form-control" />
              </div>
              <div className="form-group">
                <button className="btn btn-primary">
                  Submit
                  </button>
                <a
                  onClick={this.clearForm}
                  className="btn btn-secondary">
                  Cancel
                  </a>
              </div>
            </form>
          </Collapse>
        </div>
        <div className="col-lg-12">
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Body</th>
                <th>Cover</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.posts.map(post => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.body}</td>
                    <th>
                      <div style={{maxWidth: '10em'}}>
                      <img className="img-responsive" src={post.cover} />
                      </div>
                    </th>
                    <td>{post.categoryId}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => this.handleEdit(post)}
                          className="btn btn-warning">Edit</button>

                        <button onClick={() => this.handleDelete(post.id)}
                          className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
}
