import React, { useEffect, useContext, useState } from "react";
import { HomeLayout } from "../components/HomeLayout";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";

const getArticles = async () => {
  const response = await axios.get("http://localhost:3000/api/articles");
  return response.data.articles;
};

export const Home = () => {
  const { auth } = useContext(AuthContext);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getArticles()
      .then((articles) => {
        setArticles(articles);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <HomeLayout Header={Header} Footer={Footer}>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  {auth && (
                    <li className="nav-item">
                      <a className="nav-link" href="">
                        Your Feed
                      </a>
                    </li>
                  )}
                  <li className="nav-item">
                    <a className="nav-link active" href="">
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>

              {articles.map((article) => (
                <div className="article-preview" key={article.slug}>
                  <div className="article-meta">
                    <a href={`/profile/${article.author.username}`}>
                      <img src={article.image} alt={article.author.username} />
                    </a>
                    <div className="info">
                      <a
                        href={`/profile/${article.author.username}`}
                        className="author"
                      >
                        {article.author.username}
                      </a>
                      <span className="date">{article.createdAt}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                  <a href={`/article/${article.slug}`} className="preview-link">
                    <h1> {article.title} </h1>
                    <p> {article.description} </p>
                    <span> {article.body} </span>
                    <ul className="tag-list">
                      {article.tagList.map((tag) => (
                        <li
                          className="tag-default tag-pill tag-outline"
                          key={tag}
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))}

              <ul className="pagination">
                <li className="page-item active">
                  <a className="page-link" href="">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="">
                    2
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  <a href="" className="tag-pill tag-default">
                    programming
                  </a>
                  <a href="" className="tag-pill tag-default">
                    javascript
                  </a>
                  <a href="" className="tag-pill tag-default">
                    emberjs
                  </a>
                  <a href="" className="tag-pill tag-default">
                    angularjs
                  </a>
                  <a href="" className="tag-pill tag-default">
                    react
                  </a>
                  <a href="" className="tag-pill tag-default">
                    mean
                  </a>
                  <a href="" className="tag-pill tag-default">
                    node
                  </a>
                  <a href="" className="tag-pill tag-default">
                    rails
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};
