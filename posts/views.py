from rest_framework import viewsets, permissions, views, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from accounts.models import Follow
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        qs = Post.objects.all().select_related('author').prefetch_related('comments', 'likes')
        username = self.request.query_params.get('username')
        feed = self.request.query_params.get('feed')
        if username:
            qs = qs.filter(author__username=username)
        elif feed == 'following' and self.request.user.is_authenticated:
            following_ids = Follow.objects.filter(follower=self.request.user).values_list('following_id', flat=True)
            qs = qs.filter(Q(author_id__in=following_ids) | Q(author=self.request.user))
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        text = request.data.get('text', '').strip()
        if not text:
            return Response({'detail': 'Comment text required.'}, status=status.HTTP_400_BAD_REQUEST)
        comment = Comment.objects.create(post=post, author=request.user, text=text)
        return Response(CommentSerializer(comment, context={'request': request}).data, status=status.HTTP_201_CREATED)


class LikeToggleView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({'liked': liked, 'likes_count': post.likes.count()})
