import * as React from "react"

import {
  matchPath,
  otherwise,
  replace as originReplace,
  useUrl
} from "react-use-url"

import { Dialog } from "@reach/dialog"
import "@reach/dialog/styles.css"

import { Link } from "./Link"

const replace = (path, state = null) => originReplace(path, state, process.env.PUBLIC_URL)

const { IMAGES, getImageById } = images()

export function Example7({path}) {
  const { state: backgroundPath } = useUrl()

  const body = matchPath(backgroundPath ?? path, {
    "/": () => <Home />,
    "/gallery": () => <Gallery />,
    "/img/:id": id => <ImageView id={id} />,
    [otherwise]: () => <NoMatch />
  })

  const modal = matchPath(path, {
    "/img/:id": id => <Modal id={id} />
  })

  return (
    <>
      <Info />
      <Layout>
        {body}
      </Layout>
      {backgroundPath && modal}
    </>
  )
}

function Layout({children}) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/example7">Home</Link>
          </li>
          <li>
            <Link to="/example7/gallery">Gallery</Link>
          </li>
        </ul>
      </nav>
      <hr />
      {children}
    </div>
  )
}

function Home() {
  return (
    <div>
      <h2>Home</h2>

      <h3>Featured Images</h3>
      <ul>
        <li>
          <Link to="/example7/img/1">Image 1</Link>
        </li>
        <li>
          <Link to="/example7/img/2">Image 2</Link>
        </li>
      </ul>
    </div>
  )
}

function Gallery() {
  const { path } = useUrl()

  return (
    <div style={{ padding: "0 24px" }}>
      <h2>Gallery</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px"
        }}
      >
        {IMAGES.map(image => (
          <Link
            key={image.id}
            to={`/example7/img/${image.id}`}
            state={path.slice(2) /* remove basePath and example7 */}
            // This is the trick! Set the `backgroundLocation` in location state
            // so that when we open the modal we still see the current page in
            // the background.
          >
            <img
              width={200}
              height={200}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                height: "auto",
                borderRadius: "8px"
              }}
              src={image.src}
              alt={image.title}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

function ImageView({id}) {
  let image = getImageById(Number(id))

  if (!image) return <div>Image not found</div>

  return (
    <div>
      <h1>{image.title}</h1>
      <img width={400} height={400} src={image.src} alt="" />
    </div>
  )
}

function Modal({id}) {
  let image = getImageById(Number(id))
  let buttonRef = React.useRef(null)

  function onDismiss() {
    replace("/example7/gallery")
  }

  if (!image) return null

  return (
    <Dialog
      aria-labelledby="label"
      onDismiss={onDismiss}
      initialFocusRef={buttonRef}
    >
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          padding: "8px 8px"
        }}
      >
        <h1 id="label" style={{ margin: 0 }}>
          {image.title}
        </h1>
        <img
          style={{
            margin: "16px 0",
            borderRadius: "8px",
            width: "100%",
            height: "auto"
          }}
          width={400}
          height={400}
          src={image.src}
          alt=""
        />
        <button
          style={{ display: "block" }}
          ref={buttonRef}
          onClick={onDismiss}
        >
          Close
        </button>
      </div>
    </Dialog>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/example7">Go to the home page</Link>
      </p>
    </div>
  )
}

function Info() {
  return (
    <>
      <h1>Modal Example</h1>

      <p>
        This is an example of how to create a contextual modal navigation with
        React Router where the navigation path the user takes determines if the
        page is rendered in the modal or not (popularized by pinterest,
        instagram, and others in the 2010s). This type of modal is typically
        used as a kind of "detail" view to focus on a particular object in a
        collection (like a pinterest board) while not taking you completely out
        of context of the parent page. But, when the same URL is visited
        directly (rather than from the collection page) it renders as it's own
        full page instead of in a modal.
      </p>

      <p>
        In this example, notice how the URL updates when the modal opens (if you
        are viewing the example in StackBlitz you may need to open in a new
        browser window). Even though the URL is updated to the specific item in
        the modal, the background page is still showing behind it.
      </p>

      <p>
        Next, copy and paste the URL to a new browser tab and notice that it
        shows that specific item not in a modal, but directly on the page. This
        is the view that someone would see if they clicked on a link that you
        sent them when you had the modal open. They don't have the context you
        did when you opened the modal, so they don't see it in the context of
        the background page.
      </p>
    </>
  )
}


function images() {
  let IMAGES = [
    {
      id: 0,
      title: "Enjoying a cup of coffee",
      src: "https://images.unsplash.com/photo-1631016800696-5ea8801b3c2a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMzM2Mzg4Ng&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      id: 1,
      title: "Magical winter sunrise",
      src: "https://images.unsplash.com/photo-1618824834718-92f8469a4dd1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMzM2NDAzMw&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      id: 2,
      title: "Dalmatian and pumpkins",
      src: "https://images.unsplash.com/photo-1633289944756-6295be214e16?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMzM2NDA3Nw&ixlib=rb-1.2.1&q=80&w=400"
    },
    {
      id: 3,
      title: "Fall into Autumn 🍂🐶",
      src: "https://images.unsplash.com/photo-1633172905740-2eb6730c95b4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzMzM2NDEwMg&ixlib=rb-1.2.1&q=80&w=400"
    }
  ]

  function getImageById(id) {
    return IMAGES.find(image => image.id === id)
  }

  return { IMAGES, getImageById }
}