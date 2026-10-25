from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import PostViewSet, CommentCreateView, LikeToggleView

router = DefaultRouter()
router.register('posts', PostViewSet, basename='post')

urlpatterns = router.urls + [
    path('posts/<int:post_id>/comments/', CommentCreateView.as_view(), name='post-comments'),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='post-like'),
]
